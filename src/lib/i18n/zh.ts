import { ANSWER_MAX } from "@/lib/answer-rules";
import { NAME_MAX, NAME_MIN } from "@/lib/profile-rules";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX,
} from "@/types/poll";
import type { Dictionary } from "./ko";

export const zh: Dictionary = {
  meta: {
    title: "HanQ",
    socialTitle: "HanQ — 没有语言障碍的多语言问答",
    description:
      "用自己的语言提问，系统会自动翻译成对方的语言的多语言问答社区。文化、旅行、就业、恋爱，直接问当地人。",
    keywords: [
      "多语言社区",
      "问当地人",
      "实时翻译",
      "自动翻译问答",
      "海外文化",
      "海外旅行",
      "海外留学",
      "海外就业",
      "外语提问",
      "全球交流",
    ],
  },

  common: {
    retry: "重试",
    cancel: "取消",
    delete: "删除",
    deleting: "删除中",
    submit: "发布",
    submitting: "发布中",
    loadingQuestions: "正在加载问题",
    translating: "翻译中",
    fallbackUserName: "用户",
    dismissNotice: "关闭公告",
    skipToContent: "跳到正文",
    deleted: "已删除",
  },

  nav: {
    home: "首页",
    profile: "我的",
    askAria: "写问题",
    back: "返回",
    close: "关闭",
  },

  language: {
    switcherLegend: "显示语言",
    ko: "한국어",
    ja: "日本語",
    en: "English",
    zh: "中文",
  },

  country: {
    ko: "韩国",
    ja: "日本",
    en: "美国",
    zh: "中国",
  },

  landing: {
    heroLine1: "没有语言障碍，",
    heroLine2: "向世界各地",
    heroLine3: "提问吧",
    heroDescriptionLine1: "用自己的语言写，会自动翻译成对方的语言。",
    heroDescriptionLine2: "文化、旅行、就业，想知道的都可以轻松交流。",
    popularHeading: "当前热门问题",
    login: "用 Google 3 秒开始",
    loggingIn: "登录中...",
    terms: "注册即表示同意用户条款和隐私政策",
    loginFailed: "登录失败，请重试。",
    inAppTitle: "请在浏览器中打开",
    inAppDescription:
      "由于在应用内打开，Google 登录被阻止。点击下方按钮在浏览器中打开即可登录。",
    inAppGuideIos:
      "由于在应用内打开，Google 登录被阻止。请复制网址粘贴到 Safari，或从分享菜单在浏览器中打开。",
    openInBrowser: "在浏览器中打开",
    copyLink: "复制链接",
    copied: "已复制",
    sessionFailed: "创建会话失败。",
  },

  home: {
    title: "问题列表",
    tabLatest: "最新",
    tabPopular: "热门",
    allCategories: "全部",
    emptyAll: "还没有问题。",
    emptyFiltered: "该分类下还没有问题。",
  },

  my: {
    menuAria: "我的菜单",
    logout: "退出登录",
    editProfile: "编辑资料",
    tabQuestions: "我的提问",
    tabAnswers: "我的回答",
    emptyQuestions: "你还没有提过问题。",
    emptyAnswers: "你还没有回答过问题。",
    stats: (questions: number, answers: number, likes: number) =>
      `提问 ${questions} · 回答 ${answers} · 收到的赞 ${likes}`,
  },

  ask: {
    headerTitle: "提问",
    titleLabel: "标题",
    titlePlaceholder: "你想了解什么？",
    contentLabel: "内容",
    contentPlaceholder: "写上背景，比如和你所在的国家有什么不同，会更容易得到回答",
    categoryLegend: "分类",
    pollLegend: "投票（可选）",
    pollEnable: "为这个问题添加投票",
    pollHint: "如果是意见容易分歧的问题，可以加个投票。回答里会一并显示各自的选择。",
    pollOptionLabel: (index: number) => `选项 ${index}`,
    pollOptionPlaceholder: "例：算了",
    pollAdd: "添加选项",
    pollRemove: (index: number) => `删除选项 ${index}`,
    translationNotice:
      "发布的内容会自动翻译成其他语言一并显示。原文也会原样保存。",
    submit: "发布问题",
    submitting: "发布中...",
  },

  detail: {
    voteFailed: "投票保存失败，请重试。",
    likeFailed: "点赞保存失败，请重试。",
    headerTitle: "问题",
    answersHeading: "回答",
    emptyAnswers: "还没有回答。来写第一个回答吧。",
    answerInputLabel: "输入回答",
    answerPlaceholder: "写下你的回答吧",
    loginToAnswer: "登录后回答",
    showOriginal: "查看原文",
    showTranslation: "查看翻译",
    likeAria: (count: number) => `${count} 个赞`,
    pollHeading: "你选哪个？",
    pollTotal: (count: number) => `${count} 人参与`,
    pollEmpty: "来投第一票吧",
    pollChange: "可以重新选择",
    pollVoteAria: (label: string) => `投票给 ${label}`,
    pollResultAria: (label: string, percent: number) =>
      `${label} ${percent}%`,
  },

  profile: {
    editTitle: "编辑资料",
    photoLabel: "头像",
    photoChange: "更换头像",
    photoRemove: "删除头像",
    nameLabel: "昵称",
    namePlaceholder: "请输入 2~20 个字符",
    save: "保存",
    saving: "保存中...",
    tabQuestions: "发布的提问",
    tabAnswers: "发布的回答",
    linkAria: (name: string) => `查看 ${name} 的主页`,
  },

  deletion: {
    question: {
      menuAria: "问题菜单",
      title: "要删除这个问题吗？",
      description: "下面的回答和点赞也会一起消失，无法恢复。",
    },
    answer: {
      menuAria: "回答菜单",
      title: "要删除这个回答吗？",
      description: "无法恢复。",
    },
  },

  notification: {
    title: "通知",
    bellAria: "通知",
    unreadAria: "有未读通知",
    empty: "还没有通知。",
    message: {
      answer: (name: string) => `${name} 回答了你的问题`,
      "question-like": (name: string) => `${name} 赞了你的问题`,
      "answer-like": (name: string) => `${name} 赞了你的回答`,
    },
  },

  error: {
    pageTitle: "页面加载失败",
    pageDescription: "请稍后重试。如果一直不行，请刷新页面。",
    digest: (code: string) => `错误代码 ${code}`,
    globalTitle: "出现了问题",
    globalDescription: "请重新加载页面。",
  },

  formError: {
    TITLE_REQUIRED: "请输入标题。",
    TITLE_TOO_LONG: `标题最多 ${TITLE_MAX} 个字符。`,
    CONTENT_REQUIRED: "请输入内容。",
    CONTENT_TOO_LONG: `内容最多 ${CONTENT_MAX} 个字符。`,
    CATEGORY_REQUIRED: "请选择分类。",
    POLL_TOO_FEW_OPTIONS: `选项至少需要 ${POLL_MIN_OPTIONS} 个。`,
    POLL_TOO_MANY_OPTIONS: `最多可以添加 ${POLL_MAX_OPTIONS} 个选项。`,
    POLL_OPTION_REQUIRED: "请填写所有选项。",
    POLL_OPTION_TOO_LONG: `选项最多 ${POLL_OPTION_MAX} 个字符。`,
    POLL_OPTION_DUPLICATED: "不能填写重复的选项。",
    ANSWER_REQUIRED: "请输入回答。",
    ANSWER_TOO_LONG: `回答最多 ${ANSWER_MAX} 个字符。`,
    QUESTION_NOT_FOUND: "找不到该问题。",
    QUESTION_SUBMIT_FAILED: "发布问题失败，请重试。",
    QUESTION_DELETE_FORBIDDEN: "只能删除自己发布的问题。",
    QUESTION_DELETE_FAILED: "删除失败，请重试。",
    ANSWER_SUBMIT_FAILED: "发布回答失败，请重试。",
    ANSWER_NOT_FOUND: "找不到该回答。",
    ANSWER_DELETE_FORBIDDEN: "只能删除自己发布的回答。",
    ANSWER_DELETE_FAILED: "删除失败，请重试。",
    NAME_REQUIRED: "请输入昵称。",
    NAME_TOO_SHORT: `昵称至少需要 ${NAME_MIN} 个字符。`,
    NAME_TOO_LONG: `昵称最多 ${NAME_MAX} 个字符。`,
    IMAGE_TYPE_INVALID: "只能上传 JPG、PNG、WebP 图片。",
    IMAGE_TOO_LARGE: "图片最大 2MB。",
    PROFILE_UPDATE_FAILED: "保存资料失败，请重试。",
  },

  category: {
    korea: "韩国文化",
    japan: "日本文化",
    usa: "美国文化",
    china: "中国文化",
    career: "就业 / 大学",
    love: "恋爱",
    travel: "旅行",
    food: "美食",
    hobby: "兴趣",
    free: "自由提问",
  },

  time: {
    locale: "zh-CN",
    justNow: "刚刚",
    yesterday: "昨天",
    minutesAgo: (n: number) => `${n} 分钟前`,
    hoursAgo: (n: number) => `${n} 小时前`,
    daysAgo: (n: number) => `${n} 天前`,
  },
};
