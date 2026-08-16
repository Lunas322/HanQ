import { ANSWER_MAX } from "@/lib/answer-rules";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import type { Dictionary } from "./ko";

export const ja: Dictionary = {
  meta: {
    title: "HanQ — 言葉の心配なく、韓国と日本に聞いてみよう",
    description:
      "自分の言葉で書けば相手の言葉に自動翻訳される、日韓Q&Aコミュニティ",
  },

  common: {
    retry: "再試行",
    submit: "送信",
    submitting: "送信中",
    loadingQuestions: "質問を読み込み中",
    fallbackUserName: "ユーザー",
  },

  nav: {
    home: "ホーム",
    profile: "マイページ",
    askAria: "質問を書く",
  },

  language: {
    switcherLegend: "表示言語",
    ko: "한국어",
    ja: "日本語",
  },

  country: {
    ko: "韓国",
    ja: "日本",
  },

  landing: {
    heroLine1: "言葉の心配なく、",
    heroLine2: "韓国と日本に",
    heroLine3: "聞いてみよう",
    heroDescriptionLine1: "自分の言葉で書けば、相手の言葉に自動翻訳されます。",
    heroDescriptionLine2:
      "文化、旅行、就職まで、気になることを気軽に聞けます。",
    popularHeading: "いま人気の質問",
    login: "Googleで3秒ではじめる",
    loggingIn: "ログイン中...",
    terms: "登録すると利用規約とプライバシーポリシーに同意したことになります",
    loginFailed: "ログインに失敗しました。もう一度お試しください。",
    sessionFailed: "セッションの作成に失敗しました。",
  },

  home: {
    tabLatest: "新着",
    tabPopular: "人気",
    allCategories: "すべて",
    emptyAll: "まだ質問がありません。",
    emptyFiltered: "選択したカテゴリーにはまだ質問がありません。",
  },

  my: {
    tabQuestions: "自分の質問",
    tabAnswers: "自分の回答",
    emptyQuestions: "まだ質問を書いていません。",
    emptyAnswers: "まだ回答した質問がありません。",
    stats: (questions: number, answers: number, likes: number) =>
      `質問 ${questions}・回答 ${answers}・もらったいいね ${likes}`,
  },

  ask: {
    headerTitle: "質問する",
    titleLabel: "タイトル",
    titlePlaceholder: "何が気になりますか？",
    contentLabel: "内容",
    contentPlaceholder:
      "日本とどう違うのか、背景も一緒に書くと伝わりやすいです",
    categoryLegend: "カテゴリー",
    translationNotice:
      "投稿は韓国語に自動翻訳されて一緒に表示されます。原文もそのまま保存されます。",
    submit: "質問を投稿する",
    submitting: "投稿中...",
  },

  detail: {
    headerTitle: "質問",
    answersHeading: "回答",
    emptyAnswers: "まだ回答がありません。最初の回答を残してみましょう。",
    answerInputLabel: "回答を入力",
    answerPlaceholder: "あたたかい回答を残してみましょう",
    showOriginal: "原文を見る",
    showTranslation: "翻訳を見る",
    likeAria: (count: number) => `いいね ${count}件`,
  },

  error: {
    pageTitle: "画面を読み込めませんでした",
    pageDescription:
      "しばらくしてからもう一度お試しください。改善しない場合は再読み込みしてください。",
    digest: (code: string) => `エラーコード ${code}`,
    globalTitle: "問題が発生しました",
    globalDescription: "ページを再読み込みしてください。",
  },

  formError: {
    TITLE_REQUIRED: "タイトルを入力してください。",
    TITLE_TOO_LONG: `タイトルは${TITLE_MAX}文字まで入力できます。`,
    CONTENT_REQUIRED: "内容を入力してください。",
    CONTENT_TOO_LONG: `内容は${CONTENT_MAX}文字まで入力できます。`,
    CATEGORY_REQUIRED: "カテゴリーを選択してください。",
    ANSWER_REQUIRED: "回答を入力してください。",
    ANSWER_TOO_LONG: `回答は${ANSWER_MAX}文字まで入力できます。`,
    QUESTION_NOT_FOUND: "質問が見つかりませんでした。",
    QUESTION_SUBMIT_FAILED: "質問の投稿に失敗しました。もう一度お試しください。",
    ANSWER_SUBMIT_FAILED: "回答の投稿に失敗しました。もう一度お試しください。",
  },

  category: {
    korea: "韓国の文化",
    japan: "日本の文化",
    career: "就職・大学",
    love: "恋愛",
    travel: "旅行",
    food: "グルメ",
    hobby: "趣味",
    free: "自由質問",
  },

  time: {
    locale: "ja-JP",
    justNow: "たった今",
    yesterday: "昨日",
    minutesAgo: (n: number) => `${n}分前`,
    hoursAgo: (n: number) => `${n}時間前`,
    daysAgo: (n: number) => `${n}日前`,
  },
};
