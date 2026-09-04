import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env");
  } catch {}
}

const dryRun = process.argv.includes("--dry-run");

const TARGET = process.argv.find((arg) => arg.startsWith("--lang="))?.slice(7) ?? "en";
const TARGET_CODE = { en: "EN-US", zh: "ZH-HANS", ko: "KO", ja: "JA" }[TARGET];
const SOURCE_CODE = { ko: "KO", ja: "JA", en: "EN", zh: "ZH" };

if (!TARGET_CODE) {
  console.error(`지원하지 않는 --lang 값입니다: ${TARGET}`);
  process.exit(1);
}

const apiKey = process.env.DEEPL_API_KEY;

if (!apiKey) {
  console.error("DEEPL_API_KEY가 비어 있습니다.");
  process.exit(1);
}

const endpoint = apiKey.endsWith(":fx")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

const app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
});
const db = getFirestore(app);

async function translate(texts, source) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: texts,
      target_lang: TARGET_CODE,
      ...(SOURCE_CODE[source] ? { source_lang: SOURCE_CODE[source] } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepL ${response.status}: ${await response.text()}`);
  }

  const { translations } = await response.json();

  if (!Array.isArray(translations) || translations.length !== texts.length) {
    throw new Error("DeepL 응답 개수가 요청과 다릅니다.");
  }

  return translations.map((item) => item.text);
}

function readPath(data, path) {
  return path
    .split(".")
    .reduce((current, key) => (current == null ? undefined : current[key]), data);
}

function labelPaths(poll) {
  const ids = poll?.optionIds;
  return Array.isArray(ids) ? ids.map((id) => `poll.labels.${id}`) : [];
}

function pendingFields(data, paths, source) {
  const pending = [];

  for (const path of paths) {
    const value = readPath(data, path);

    if (value == null || typeof value !== "object") continue;
    if (typeof value[TARGET] === "string" && value[TARGET] !== "") continue;

    const original = value[source];

    if (typeof original !== "string" || original.trim() === "") continue;

    pending.push({ path, value, original });
  }

  return pending;
}

async function backfill(collection, pathsOf) {
  const snapshot = await db.collection(collection).get();

  let translated = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const source = ["ko", "ja", "en", "zh"].includes(data.sourceLanguage)
      ? data.sourceLanguage
      : "ko";

    if (source === TARGET) {
      skipped += 1;
      continue;
    }

    const fields = pendingFields(data, pathsOf(data), source);

    if (fields.length === 0) {
      skipped += 1;
      continue;
    }

    console.log(
      `${collection}/${doc.id} (${source} → ${TARGET}, 필드 ${fields.length}개)`,
    );

    for (const field of fields) {
      console.log(`  ${field.path}: ${field.original.slice(0, 40)}…`);
    }

    if (dryRun) {
      translated += 1;
      continue;
    }

    const texts = await translate(
      fields.map((field) => field.original),
      source,
    );

    const update = { translationStatus: "done" };

    fields.forEach((field, index) => {
      update[field.path] = { ...field.value, [TARGET]: texts[index] };
    });

    await doc.ref.update(update);
    translated += 1;
  }

  return { translated, skipped };
}

const questions = await backfill("questions", (data) => [
  "title",
  "content",
  ...labelPaths(data.poll),
]);

const answers = await backfill("answers", () => ["content"]);

const total = questions.translated + answers.translated;

console.log(
  `\nquestions: ${questions.translated}건 대상 / ${questions.skipped}건 건너뜀`,
);
console.log(
  `answers: ${answers.translated}건 대상 / ${answers.skipped}건 건너뜀`,
);

if (dryRun) {
  console.log(`\n--dry-run 이므로 쓰지 않았습니다. (대상 ${total}건)`);
} else {
  console.log(`\n✓ ${total}건에 ${TARGET} 번역을 채웠습니다.`);
}

process.exit(0);
