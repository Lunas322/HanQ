# HanQ 전체 QA 리포트

- 일시: 2026-08-25
- 브랜치: `develop` (`0f9c235`)
- 대상: 정적 검사(lint / typecheck / build) + 코드 리뷰 + 로컬 프로덕션 서버 런타임 점검
- 환경: Next.js 16.2.12 / React 19.2.4 / `cacheComponents: true` (PPR) / Firebase Admin

---

## 0. 요약

| 구분 | 결과 |
|---|---|
| `npm run lint` | ✅ 통과 (경고 0) |
| `npm run typecheck` | ✅ 통과 (`any` 0개, `TODO`/`console.log` 잔재 0개) |
| `npm run build` | ✅ 통과 (36 페이지 프리렌더, 4.4s) |
| 라우트 스모크 테스트 | ⚠️ 22개 중 2개 이상 동작 (상세 404가 HTTP 200) |
| 보안 | ❌ P0 1건 (저장형 XSS) |
| 캐시 무효화 | ⚠️ 죽은 태그 1건, 무의미한 `revalidatePath` 1건 |
| 테스트 코드 | ❌ 없음 |

**결론: P0 1건을 고치기 전에는 배포하지 말 것.** 나머지는 배포 가능하지만 P1은 다음 스프린트 안에 정리 권장.

---

## 1. P0 — 즉시 수정

### 1-1. JSON-LD 저장형 XSS

- 위치: `src/app/components/QuestionJsonLd.tsx:39`
- 사인: `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`

`JSON.stringify`는 JSON 문법만 이스케이프하고 **HTML 문법은 이스케이프하지 않는다.** `<`를 그대로 통과시킨다.

```
$ node -e 'console.log(JSON.stringify({name:"</script><img src=x onerror=alert(1)>"}))'
{"name":"</script><img src=x onerror=alert(1)>"}
```

질문 제목 / 본문 / 답변 내용 / 작성자 이름이 전부 이 객체에 들어간다. 그중 하나에 `</script>`가 포함되면 HTML 파서가 그 지점에서 `<script>`를 닫아버리고, 뒤에 오는 문자열은 마크업으로 해석된다. 제목은 60자, 답변은 500자까지 자유 입력이므로 **로그인한 사용자 누구나 질문 하나만 올리면 그 상세 페이지를 보는 모든 사람의 브라우저에서 임의 스크립트를 실행**할 수 있다. 세션 쿠키는 `httpOnly`라 직접 탈취는 안 되지만, 그 스크립트는 이미 피해자 세션으로 서버 액션을 호출할 수 있다(글 삭제, 프로필 변경 등).

- 재현: 제목이나 본문에 `</script><img src=x onerror=alert(1)>` 를 넣어 질문 작성 → 해당 상세 페이지 열기
- 수정 방향: 직렬화 결과 문자열에서 `<` 문자를 JSON 유니코드 이스케이프(백슬래시 + `u003c`)로 치환한 뒤 주입한다. JSON 파서 입장에서는 같은 문자라 구조화 데이터의 의미는 변하지 않고, HTML 파서만 속지 않게 된다.
- 참고: 프로젝트 전체에서 `dangerouslySetInnerHTML`은 이 한 곳뿐이다(`grep` 확인). 나머지 사용자 입력은 전부 JSX로 렌더되어 React가 이스케이프한다.

---

## 2. P1 — 배포 전 정리 권장

### 2-1. `revalidatePath("/home")`은 아무것도 무효화하지 않는다

- 위치: `src/app/[lang]/notifications/_actions/read.ts:18`

실제 라우트는 `/[lang]/home`이다. `/home`이라는 페이지 경로는 존재하지 않으므로 이 호출은 무효다(동적 세그먼트가 있는 경로는 `/[lang]/home` 리터럴을 넘겨야 한다).

덧붙여, 알림 뱃지를 그리는 `NotificationBell`은 `countUnreadNotifications`를 캐시 없이 매 요청 직접 조회한다(`src/app/components/NotificationBell.tsx:12`). 즉 이 `revalidatePath`는 **경로를 고쳐도 하는 일이 없는 코드**다. 반면 진짜 문제는 남아 있다: 알림 페이지에서 읽음 처리 후에도 **현재 화면의 안 읽음 배경색(`bg-brand-subtle`)이 그대로**다. 다시 들어와야 갱신된다.

- 판단 필요: 이 줄을 지울 것인가, 아니면 `router.refresh()` 계열로 현재 화면을 다시 그릴 것인가.

### 2-2. `questionTag()`는 어디에도 붙어 있지 않은 죽은 태그

- 위치: `src/lib/cache-tags.ts:5`, `src/app/[lang]/detail/[id]/_actions/revalidate.ts:7`, `src/lib/translations.ts:107`

`questionTag(id)`는 **무효화하는 쪽에서만 3번 호출되고, 캐시 엔트리에 태그로 붙는 곳이 0곳**이다. 질문 단건 캐시(`fetchQuestion`, `src/lib/questions.ts:233`)는 `QUESTIONS_TAG`로 태그되어 있다.

결과적으로 좋아요 하나, 투표 하나, 답변 하나마다 `updateTag(QUESTIONS_TAG)`가 돌면서 **홈 목록 · 마이 목록 · 모든 질문 단건 캐시가 전역으로 한꺼번에 날아간다.** 질문 수가 늘수록 Firestore 읽기 비용과 응답 지연으로 직결된다.

- 수정 방향: `fetchQuestion`의 `tags`에 `questionTag(id)`를 추가하고, 상세에서만 일어나는 변경(좋아요/투표/답변)은 `QUESTIONS_TAG`를 건드리지 않도록 분리한다. 목록 카드에 표시되는 `likeCount`/`commentCount` 신선도를 어디까지 포기할지가 트레이드오프.

### 2-3. `NEXT_PUBLIC_SITE_URL` 미설정 — sitemap/robots/OG가 localhost를 가리킴

- 위치: `src/lib/site.ts:1`, `.env`

로컬 `.env`에 `NEXT_PUBLIC_SITE_URL` 키가 아예 없다. 실제 출력:

```
$ curl -s localhost:3000/sitemap.xml | head -4
<loc>http://localhost:3000/ko</loc>
$ curl -s localhost:3000/robots.txt | tail -2
Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

Vercel 프로젝트 환경변수에 이 값이 있으면 프로덕션은 정상이지만, **없으면 sitemap · robots · canonical · hreflang · og:image가 전부 localhost로 나가서 색인이 통째로 망가진다.** 이 서비스는 SEO가 핵심 유입 경로이므로 배포 전 반드시 확인.

- 확인 방법: `vercel env ls` 또는 Vercel 대시보드 → Environment Variables (Production/Preview 양쪽)
- 부수 정리: `SITE_URL`이 `src/lib/site.ts`와 `src/app/[lang]/layout.tsx:19` 두 곳에 중복 정의되어 있다. 한쪽만 남길 것.

### 2-4. 보안 헤더가 하나도 없다

로컬 프로덕션 서버 응답 헤더 확인 결과 `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` **0건**.

세션 쿠키를 쓰고 서드파티 스크립트(AdSense)를 붙이는 서비스에서 CSP 부재는 1-1의 XSS 영향 범위를 그대로 키운다. `X-Frame-Options`/`frame-ancestors` 부재는 클릭재킹에 노출된다. 쿠키 자체는 `httpOnly` + `sameSite=lax` + 프로덕션 `secure`로 잘 설정되어 있다(`src/app/api/session/route.ts:40`).

- 수정 방향: `next.config.ts`의 `headers()`로 추가. CSP는 AdSense/Vercel Analytics 도메인 허용이 필요하므로 `Report-Only`부터 시작할 것.
- 부수: 언어 쿠키 `hanq-lang`은 `secure` 없이 내려간다(`src/middleware.ts:85`). 민감정보는 아니지만 일관성 차원에서 검토.

### 2-5. 투표 실패가 사용자에게 전혀 보이지 않는다

- 위치: `src/app/[lang]/detail/[id]/_actions/vote.ts:19-24`

`votePoll`이 던진 에러를 `console.error` 후 `return;`으로 삼킨다. 반환 타입이 `Promise<void>`라 클라이언트가 실패를 알 방법이 없다.

`PollVote`는 `useOptimistic`으로 즉시 막대를 그린다(`src/app/components/PollVote.tsx:60-64`). 트랜잭션이 끝나면 낙관적 상태가 폐기되고 서버 상태로 되돌아가므로, **사용자는 "눌렀는데 잠깐 반영됐다가 슬쩍 원래대로 돌아가는" 화면만 본다.** 이유도 재시도 안내도 없다.

- 참고: 삭제(`delete.ts`)와 폼 제출(`answer.ts`, `actions.ts`)은 `FormErrorCode`를 반환해 UI에 노출한다. 투표와 좋아요만 이 규약에서 빠져 있다.

### 2-6. 좋아요 실패는 페이지 전체를 에러 화면으로 날린다

- 위치: `src/app/[lang]/detail/[id]/_actions/like.ts:21`, `src/lib/likes.ts:80`

`toggleLike`는 대상 문서가 없으면 `throw`한다. `toggleQuestionLikeAction`에는 `try/catch`가 없다. 클라이언트에서는 `startTransition` 안의 `await onToggle()`이 그대로 reject되어(`src/app/components/LikeButton.tsx:38-41`) `error.tsx` 경계까지 올라간다.

- 재현 시나리오: A가 상세 페이지를 열어둔 채, B(작성자)가 그 질문을 삭제 → A가 하트를 누름 → 상세 화면 전체가 😵 에러 페이지로 교체됨
- 2-5와 같은 원인의 반대편 증상이다. 두 액션의 실패 처리 규약을 같이 정하는 게 맞다.

### 2-7. 언어 감지가 `Accept-Language`를 무시한다

- 위치: `src/middleware.ts:31-41`, `src/lib/locale.ts:26-42`

감지 순서는 `hanq-lang` 쿠키 → `x-vercel-ip-country` → `ko` 고정이다. 실측:

```
Accept-Language: ja-JP,ja;q=0.9  →  /ko    ← 일본어 사용자가 한국어 화면
x-vercel-ip-country: JP          →  /ja
Cookie: hanq-lang=ja             →  /ja
```

한·일 양방향이 존재 이유인 서비스인데, **일본에 있지 않은 일본어 사용자(재한 일본인, 유학생, 여행 중)는 첫 화면이 무조건 한국어**다. 첫인상에서 이탈할 가능성이 큰 구간이다. 그리고 로컬 개발에서는 `x-vercel-ip-country`가 아예 없어 `ja` 경로를 사실상 테스트하지 못한다.

- 수정 방향: 쿠키 → `Accept-Language` → geo → 기본값 순으로 한 단계 끼워 넣기. `Accept-Language` 파싱은 `q` 가중치 처리가 필요하다.

### 2-8. CI가 `next build`를 돌리지 않는다

- 위치: `.github/workflows/ci.yml`

`Lint`와 `Typecheck` 두 스텝뿐이다. 프리렌더 단계에서만 터지는 문제(서버 컴포넌트 경계 위반, `cacheComponents` 규칙 위반, 정적 생성 중 예외)는 **CI를 전부 통과한 뒤 Vercel 배포에서 처음 발견된다.**

- 수정 방향: `- run: npm run build` 스텝 추가. 다만 `src/lib/firebase-admin.ts:10`이 `FIREBASE_SERVICE_ACCOUNT_KEY` 없으면 모듈 로드 시점에 throw하므로, CI에 더미 자격증명을 넣든지 이 검증을 지연시키든지 결정이 필요하다.

---

## 3. P2 — 개선 항목

### 데이터 / 캐시

| # | 위치 | 내용 |
|---|---|---|
| 3-1 | `src/lib/answers.ts:83,117` | `unstable_cache` 이중 중첩. Next 내부는 중첩된 `unstable_cache`를 감지하면(`isNestedUnstableCache`) **캐시 읽기를 건너뛰고 콜백을 무조건 실행한 뒤, 읽히지 않을 엔트리를 한 번 더 쓴다.** 즉 안쪽 `fetchAnswers`는 캐시 역할을 전혀 못 하고 요청마다 쓰기 비용만 추가한다. 무효화는 바깥 래퍼(`answersTag`)가 맡고 있어 동작은 정상 — 순수한 죽은 코드다. 안쪽을 평범한 함수로 되돌릴 것. |
| 3-2 | `src/lib/questions.ts:304`, `src/lib/answers.ts:217` | 질문/답변 삭제 시 **다른 사용자의 알림 문서가 남는다.** `listNotifications`가 미리보기 `null`인 항목을 걸러내 화면엔 안 보이지만(`src/lib/notifications.ts:214`), 고아 문서는 무한히 쌓이고 `LIST_LIMIT = 50` 안에서 자리를 차지해 **정상 알림이 목록에서 밀려난다.** |
| 3-3 | `src/lib/notifications.ts:120-137` | `markNotificationsRead`가 한 번에 50개만 처리. 안 읽은 알림이 50개를 넘으면 나머지는 영원히 안 읽음으로 남고 뱃지가 안 꺼진다. |
| 3-4 | `src/lib/questions.ts:29`, `src/lib/answers.ts:28` | 목록 상한이 각각 50 / 100 고정이고 페이지네이션이 없다. 질문이 50개를 넘는 순간 오래된 글은 어디서도 도달 불가(sitemap 제외). 홈 정렬·카테고리 필터도 **가져온 50개 안에서만** 동작하므로 "인기순"이 전체 인기순이 아니다. |
| 3-5 | `src/lib/questions.ts:309-323`, `src/lib/answers.ts:219-236` | 카운터 정리 배치가 실패해도 `console.error`만 하고 `"ok"`를 반환한다. `questionCount` / `answerCount` / `receivedLikeCount`가 조용히 어긋난다. 재계산 스크립트나 정합성 점검 수단이 필요하다. |
| 3-6 | 전역 | **서버 액션에 레이트 리밋이 없다.** 질문 작성 1건 = DeepL 호출 1건이므로, 로그인 계정 하나로 반복 제출하면 번역 API 비용과 Firestore 쓰기가 그대로 증폭된다. 최소한 사용자당 분당 작성 수 제한 검토. |

### 라우팅 / SEO

| # | 위치 | 내용 |
|---|---|---|
| 3-7 | `src/app/[lang]/detail/[id]/page.tsx:146` | **없는 질문 URL이 HTTP 200을 반환한다.** PPR로 정적 셸이 먼저 나간 뒤 `notFound()`가 스트림 중간에 발생하기 때문에 상태 코드를 바꿀 수 없다. 본문은 정상 404 화면 + `<meta name="robots" content="noindex">`라 색인은 막히지만, 크롤러 관점에서는 소프트 404다. `/ko/users/{없는id}`도 동일. |
| 3-8 | `src/middleware.ts:21,48` | `LOCALE_SEGMENT`(2글자)에 걸리는 경로는 통과시켜 404로 보낸다. `/en/detail/xxx` 같은 외부 유입 링크가 리다이렉트 없이 죽는다. 의도된 동작인지 확인 필요. |
| 3-9 | `src/app/manifest.ts:7-8` | `description`이 한국어 고정 — 일본어 사용자 PWA 설치 화면에도 한국어가 뜬다. `start_url: "/"`은 실행할 때마다 미들웨어 리다이렉트를 한 번 거친다. |
| 3-10 | `src/app/robots.ts:18` | `host` 지시어는 Google이 무시한다(Yandex 전용). 해가 되진 않음. |

### 클라이언트 / UX / 접근성

| # | 위치 | 내용 |
|---|---|---|
| 3-11 | `src/app/[lang]/profile/edit/ProfileEditForm.tsx:43-51` | `validateImage`를 **리사이즈 전에** 돌린다. 요즘 폰 사진은 대부분 2MB를 넘으므로, 512px로 줄이면 충분히 통과할 이미지가 선택 즉시 거부된다. 순서를 바꾸면 해결되지만, 그러면 신뢰할 수 없는 클라이언트 리사이즈 결과만 서버 검증에 걸린다 — 서버 쪽 `validateImage`(`_actions/profile.ts:43`)는 그대로 두는 게 맞다. |
| 3-12 | `ProfileEditForm.tsx:55` | `URL.createObjectURL`을 `revokeObjectURL` 없이 사용. 사진을 여러 번 바꾸면 그만큼 누수. |
| 3-13 | `src/app/components/PollBuilder.tsx:52` | 리스트 `key={index}`. 중간 선택지를 삭제하면 입력 요소가 재사용되어 포커스/IME 조합 상태가 엉뚱한 칸으로 옮겨간다. |
| 3-14 | `src/app/components/OpenInBrowser.tsx:26` | `copied`가 `true`가 된 뒤 되돌아오지 않아 버튼이 "복사됨"에 고정된다. |
| 3-15 | `src/lib/auth.ts:24` | `resolveDisplayName(decoded.name)` — 언어 인자를 안 넘겨 기본값 `"ko"`가 쓰인다. 이름 없는 일본어 사용자에게 한국어 대체 이름이 보인다. |
| 3-16 | `src/app/components/DeleteMenu.tsx:93`, `ProfileMenu.tsx:41` | 모달/메뉴에 포커스 트랩과 방향키 이동이 없다. Escape 닫기와 `aria-*`는 되어 있어 절반은 충족. 오버레이 `div`의 `onClick`은 키보드로 접근 불가(단, Escape가 대체 경로라 치명적이진 않음). |
| 3-17 | `src/app/components/RelativeTime.tsx` | `subscribe`가 no-op이라 "3분 전"이 화면에 머무는 동안 갱신되지 않는다. 의도라면 그대로 둬도 됨. |
| 3-18 | `src/app/[lang]/layout.tsx:105-111` | AdSense `<script>`를 `<head>`에 직접 넣었다. `next/script`를 쓰면 로드 전략을 제어할 수 있다. 한·일 대상 서비스이므로 광고 개인화 동의(PIPA/APPI) 처리도 별도 검토 필요. |

### 프로젝트 위생

| # | 내용 |
|---|---|
| 3-19 | **테스트 코드가 0건.** `validateQuestionDraft`, `validatePollLabels`, `detectLanguage`, `readLocalizedText`, `isInAppBrowser`는 전부 순수 함수라 Vitest 붙이기 가장 쉬운 지점이다. 커리큘럼 Phase 4 항목이기도 하다. |
| 3-20 | 저장소 루트에 `.env.zip`(2.3KB)이 있다. `.gitignore`의 `.env*`에 걸려 추적되지는 않지만, 자격증명 사본을 작업 디렉터리에 두는 건 위험하다. |
| 3-21 | `scripts/`(seed/unseed/check-storage)가 추적되지 않은 상태(`?? scripts/`)다. 커밋할지 무시할지 정할 것. |

---

## 4. 잘 되어 있는 것

기록해 둘 만한 부분.

- **타입 정직성**: `any` 0개, `as` 단언은 타입가드 내부의 관용적 사용뿐. Firestore의 `unknown`을 `readString`/`readNumber`/`readDate`/`readLocalizedText`로 한 겹 걸러 도메인 타입으로 좁히는 경계 설계가 일관적이다.
- **에러 코드 규약**: `FormErrorCode` 유니온 + `Extract<>`로 도메인별 부분집합을 뽑아 쓰는 방식 덕에, 사전에 문구가 빠지면 타입 에러로 잡힌다.
- **i18n 파리티**: `ko.ts` / `ja.ts` 키 구조 완전 일치(스크립트 확인). UI 문자열 중 하드코딩된 한국어는 `manifest.ts` 하나뿐.
- **인증 경계**: 클라이언트 Firebase SDK는 auth만 초기화하고 Firestore/Storage를 노출하지 않는다. 모든 쓰기가 Admin SDK 경유 서버 액션이며, 액션마다 `getCurrentUser()` 확인이 있고 삭제는 `authorId !== requesterId` 검사까지 한다.
- **로그아웃 프리페치 함정 회피**: `ProfileMenu.tsx:53`에서 `<Link>` 대신 `<a>`를 쓰고 이유를 주석으로 남겨 둔 것 — 실제로 밟기 쉬운 지뢰다.
- **로딩 UX**: 모든 라우트에 `loading.tsx`가 있고, 스켈레톤이 실제 레이아웃 치수를 따라가서 CLS가 거의 없다. `LoadingAnnouncement`로 스크린리더 안내까지 있다.
- **트랜잭션 사용**: 좋아요 토글과 투표 모두 `runTransaction` 안에서 카운터와 서브컬렉션을 함께 다뤄 경쟁 조건을 막았다. 투표는 선택지 유효성까지 트랜잭션 안에서 재검증한다.

---

## 5. 처리 순서 제안

1. **1-1 XSS** — 다른 어떤 것보다 먼저.
2. **2-3 `NEXT_PUBLIC_SITE_URL`** — Vercel 환경변수 확인만 하면 되는 5분짜리. 확인 안 하면 색인이 통째로 날아간다.
3. **2-5 / 2-6 실패 처리** — 두 개를 한 규약으로 묶어서 한 번에.
4. **2-2 캐시 태그** — 지금은 규모가 작아 안 아프지만, 질문 수가 늘수록 비용이 선형으로 커진다.
5. **2-8 CI build** + **3-19 테스트** — 이후 회귀를 잡아줄 안전망.
6. 나머지 P2.

---

## 6. 검증 로그

```
npm run lint       → 출력 없음 (통과)
npm run typecheck  → 통과
npm run build      → 통과, 36/36 정적 페이지 생성

라우트 스모크 (npm run start, 비로그인 상태)
/                          307 → /ko
/ko, /ja                   200
/home                      307 → /ko/home
/ko/home|ask|my            307 → /ko          (미들웨어 보호 정상)
/ko/notifications          307 → /ko
/ko/profile/edit           307 → /ko
/logout                    307 → /            (쿠키 삭제 후 리다이렉트, 루프 없음)
/en, /en/home, /zz         404
/robots.txt                200
/sitemap.xml               200  (실제 Firestore 데이터 반영 확인)
/llms.txt                  200
/manifest.webmanifest      200
/icon.svg, /icons/192      200
/apple-icon                200
/ko/opengraph-image        200 image/png
/ko/detail/{없는id}        200  ← 3-7
/ko/users/{없는id}         200  ← 3-7

언어 감지
x-vercel-ip-country: JP          → /ja
Cookie: hanq-lang=ja             → /ja
Accept-Language: ja-JP,ja;q=0.9  → /ko   ← 2-7

보안 헤더
CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy → 0건

접근성 표본
<html lang="ko"> 정상
/ko        h1 1 · h2 1 · h3 3   (계층 정상)
/ko/detail h1 1 · h2 2          (계층 정상)
alt 없는 <img> 0건
```
