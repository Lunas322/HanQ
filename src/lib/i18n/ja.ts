import { ANSWER_MAX } from "@/lib/answer-rules";
import { NAME_MAX, NAME_MIN } from "@/lib/profile-rules";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX,
} from "@/types/poll";
import type { Dictionary } from "./ko";

export const ja: Dictionary = {
  meta: {
    title: "HanQ",
    socialTitle: "HanQ — 韓国と日本を、言葉の壁なく",
    description:
      "日本語で質問すれば韓国語に、韓国語の回答は日本語に自動翻訳される日韓Q&Aコミュニティ。文化・旅行・就職・恋愛まで、現地の人に直接聞けます。",
    keywords: [
      "日韓コミュニティ",
      "韓国 日本 質問",
      "リアルタイム翻訳",
      "自動翻訳 Q&A",
      "韓国文化",
      "韓国旅行",
      "韓国留学",
      "韓国就職",
      "韓国語 質問",
      "日韓交流",
    ],
  },

  common: {
    retry: "再試行",
    cancel: "キャンセル",
    delete: "削除",
    deleting: "削除中",
    submit: "送信",
    submitting: "送信中",
    loadingQuestions: "質問を読み込み中",
    translating: "翻訳中",
    fallbackUserName: "ユーザー",
    dismissNotice: "お知らせを閉じる",
  },

  nav: {
    home: "ホーム",
    profile: "マイページ",
    askAria: "質問を書く",
    back: "戻る",
    close: "閉じる",
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
    menuAria: "マイページメニュー",
    logout: "ログアウト",
    editProfile: "プロフィール編集",
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
    pollLegend: "投票（任意）",
    pollEnable: "この質問に投票をつける",
    pollHint: "意見が分かれる質問なら投票をつけてみましょう。回答にそれぞれの選択が一緒に表示されます。",
    pollOptionLabel: (index: number) => `選択肢 ${index}`,
    pollOptionPlaceholder: "例: 許す",
    pollAdd: "選択肢を追加",
    pollRemove: (index: number) => `選択肢 ${index} を削除`,
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
    loginToAnswer: "ログインして回答する",
    showOriginal: "原文を見る",
    showTranslation: "翻訳を見る",
    likeAria: (count: number) => `いいね ${count}件`,
    pollHeading: "あなたの選択は？",
    pollTotal: (count: number) => `${count}人が参加`,
    pollEmpty: "最初の投票をしてみましょう",
    pollChange: "選び直せます",
    pollVoteAria: (label: string) => `${label}に投票する`,
    pollResultAria: (label: string, percent: number) =>
      `${label} ${percent}パーセント`,

  },

  profile: {
    editTitle: "プロフィール編集",
    photoLabel: "プロフィール写真",
    photoChange: "写真を変更",
    photoRemove: "写真を削除",
    nameLabel: "ニックネーム",
    namePlaceholder: "2〜20文字で入力してください",
    save: "保存",
    saving: "保存中...",
    tabQuestions: "書いた質問",
    tabAnswers: "書いた回答",
    linkAria: (name: string) => `${name}さんのプロフィールを見る`,
  },

  deletion: {
    question: {
      menuAria: "質問メニュー",
      title: "この質問を削除しますか？",
      description: "ついた回答といいねも一緒に消えます。元に戻せません。",
    },
    answer: {
      menuAria: "回答メニュー",
      title: "この回答を削除しますか？",
      description: "元に戻せません。",
    },
  },

  notification: {
    title: "お知らせ",
    bellAria: "お知らせ",
    unreadAria: "未読のお知らせあり",
    empty: "まだお知らせがありません。",
    message: {
      answer: (name: string) => `${name}さんが回答しました`,
      "question-like": (name: string) => `${name}さんがあなたの質問にいいねしました`,
      "answer-like": (name: string) => `${name}さんがあなたの回答にいいねしました`,
    },
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
    POLL_TOO_FEW_OPTIONS: `選択肢は${POLL_MIN_OPTIONS}つ以上必要です。`,
    POLL_TOO_MANY_OPTIONS: `選択肢は${POLL_MAX_OPTIONS}つまで作れます。`,
    POLL_OPTION_REQUIRED: "選択肢をすべて入力してください。",
    POLL_OPTION_TOO_LONG: `選択肢は${POLL_OPTION_MAX}文字まで入力できます。`,
    POLL_OPTION_DUPLICATED: "同じ選択肢は二度使えません。",
    ANSWER_REQUIRED: "回答を入力してください。",
    ANSWER_TOO_LONG: `回答は${ANSWER_MAX}文字まで入力できます。`,
    QUESTION_NOT_FOUND: "質問が見つかりませんでした。",
    QUESTION_SUBMIT_FAILED: "質問の投稿に失敗しました。もう一度お試しください。",
    QUESTION_DELETE_FORBIDDEN: "自分が書いた質問だけ削除できます。",
    QUESTION_DELETE_FAILED: "削除に失敗しました。もう一度お試しください。",
    ANSWER_SUBMIT_FAILED: "回答の投稿に失敗しました。もう一度お試しください。",
    ANSWER_NOT_FOUND: "回答が見つかりませんでした。",
    ANSWER_DELETE_FORBIDDEN: "自分が書いた回答だけ削除できます。",
    ANSWER_DELETE_FAILED: "削除に失敗しました。もう一度お試しください。",
    NAME_REQUIRED: "ニックネームを入力してください。",
    NAME_TOO_SHORT: `ニックネームは${NAME_MIN}文字以上にしてください。`,
    NAME_TOO_LONG: `ニックネームは${NAME_MAX}文字まで入力できます。`,
    IMAGE_TYPE_INVALID: "JPG、PNG、WebP画像のみアップロードできます。",
    IMAGE_TOO_LARGE: "画像は2MBまでアップロードできます。",
    PROFILE_UPDATE_FAILED: "プロフィールの保存に失敗しました。もう一度お試しください。",
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
