import { ANSWER_MAX } from "@/lib/answer-rules";
import { NAME_MAX, NAME_MIN } from "@/lib/profile-rules";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX,
} from "@/types/poll";
import type { Dictionary } from "./ko";

export const en: Dictionary = {
  meta: {
    title: "HanQ",
    socialTitle: "HanQ — Ask across languages, worry-free",
    description:
      "A multilingual Q&A community where your question is automatically translated into the reader's language. Ask locals directly about culture, travel, careers, and relationships.",
    keywords: [
      "multilingual community",
      "ask locals",
      "real-time translation",
      "auto-translated Q&A",
      "culture questions",
      "travel questions",
      "study abroad",
      "working abroad",
      "language exchange",
      "global community",
    ],
  },

  common: {
    retry: "Retry",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting",
    submit: "Post",
    submitting: "Posting",
    loadingQuestions: "Loading questions",
    translating: "Translating",
    fallbackUserName: "User",
    dismissNotice: "Dismiss notice",
    skipToContent: "Skip to content",
    deleted: "Deleted",
  },

  nav: {
    home: "Home",
    profile: "Profile",
    askAria: "Ask a question",
    back: "Back",
    close: "Close",
  },

  language: {
    switcherLegend: "Display language",
    ko: "한국어",
    ja: "日本語",
    en: "English",
  },

  country: {
    ko: "Korea",
    ja: "Japan",
    en: "United States",
  },

  landing: {
    heroLine1: "No language barrier,",
    heroLine2: "ask anyone,",
    heroLine3: "anywhere",
    heroDescriptionLine1:
      "Write in your language — it's auto-translated for the reader.",
    heroDescriptionLine2:
      "Ask about culture, travel, careers, and more, easily.",
    popularHeading: "Popular questions right now",
    login: "Start in 3 seconds with Google",
    loggingIn: "Signing in...",
    terms: "By signing up you agree to the Terms and Privacy Policy",
    loginFailed: "Sign-in failed. Please try again.",
    inAppTitle: "Please open in your browser",
    inAppDescription:
      "Google sign-in is blocked inside this in-app browser. Tap the button below to open it in your browser to sign in.",
    inAppGuideIos:
      "Google sign-in is blocked inside this in-app browser. Copy the link into Safari, or use the share menu to open it in your browser.",
    openInBrowser: "Open in browser",
    copyLink: "Copy link",
    copied: "Copied",
    sessionFailed: "Failed to create a session.",
  },

  home: {
    title: "Questions",
    tabLatest: "Latest",
    tabPopular: "Popular",
    allCategories: "All",
    emptyAll: "No questions yet.",
    emptyFiltered: "No questions in this category yet.",
  },

  my: {
    menuAria: "Profile menu",
    logout: "Log out",
    editProfile: "Edit profile",
    tabQuestions: "My questions",
    tabAnswers: "My answers",
    emptyQuestions: "You haven't asked anything yet.",
    emptyAnswers: "You haven't answered anything yet.",
    stats: (questions: number, answers: number, likes: number) =>
      `${questions} questions · ${answers} answers · ${likes} likes received`,
  },

  ask: {
    headerTitle: "Ask a question",
    titleLabel: "Title",
    titlePlaceholder: "What do you want to know?",
    contentLabel: "Details",
    contentPlaceholder:
      "Adding some background, like how this compares to your own country, helps",
    categoryLegend: "Category",
    pollLegend: "Poll (optional)",
    pollEnable: "Add a poll to this question",
    pollHint:
      "If opinions might differ, add a poll — each answer will show the responder's pick.",
    pollOptionLabel: (index: number) => `Option ${index}`,
    pollOptionPlaceholder: "e.g. Let it go",
    pollAdd: "Add option",
    pollRemove: (index: number) => `Remove option ${index}`,
    translationNotice:
      "Your post is auto-translated into other languages and shown alongside it. The original is kept as-is.",
    submit: "Post question",
    submitting: "Posting...",
  },

  detail: {
    voteFailed: "Couldn't save your vote. Please try again.",
    likeFailed: "Couldn't save your like. Please try again.",
    headerTitle: "Question",
    answersHeading: "Answers",
    emptyAnswers: "No answers yet. Be the first to answer.",
    answerInputLabel: "Write an answer",
    answerPlaceholder: "Share a helpful answer",
    loginToAnswer: "Log in to answer",
    showOriginal: "Show original",
    showTranslation: "Show translation",
    likeAria: (count: number) => `${count} likes`,
    pollHeading: "What's your pick?",
    pollTotal: (count: number) => `${count} participants`,
    pollEmpty: "Be the first to vote",
    pollChange: "You can change your pick",
    pollVoteAria: (label: string) => `Vote for ${label}`,
    pollResultAria: (label: string, percent: number) =>
      `${label} ${percent} percent`,
  },

  profile: {
    editTitle: "Edit profile",
    photoLabel: "Profile photo",
    photoChange: "Change photo",
    photoRemove: "Remove photo",
    nameLabel: "Nickname",
    namePlaceholder: "2–20 characters",
    save: "Save",
    saving: "Saving...",
    tabQuestions: "Questions",
    tabAnswers: "Answers",
    linkAria: (name: string) => `View ${name}'s profile`,
  },

  deletion: {
    question: {
      menuAria: "Question menu",
      title: "Delete this question?",
      description: "Its answers and likes will be deleted too. This can't be undone.",
    },
    answer: {
      menuAria: "Answer menu",
      title: "Delete this answer?",
      description: "This can't be undone.",
    },
  },

  notification: {
    title: "Notifications",
    bellAria: "Notifications",
    unreadAria: "Unread notifications",
    empty: "No notifications yet.",
    message: {
      answer: (name: string) => `${name} answered your question`,
      "question-like": (name: string) => `${name} liked your question`,
      "answer-like": (name: string) => `${name} liked your answer`,
    },
  },

  error: {
    pageTitle: "Couldn't load this page",
    pageDescription: "Please try again in a moment, or refresh if it keeps happening.",
    digest: (code: string) => `Error code ${code}`,
    globalTitle: "Something went wrong",
    globalDescription: "Please refresh the page.",
  },

  formError: {
    TITLE_REQUIRED: "Please enter a title.",
    TITLE_TOO_LONG: `Title can be up to ${TITLE_MAX} characters.`,
    CONTENT_REQUIRED: "Please enter some content.",
    CONTENT_TOO_LONG: `Content can be up to ${CONTENT_MAX} characters.`,
    CATEGORY_REQUIRED: "Please choose a category.",
    POLL_TOO_FEW_OPTIONS: `Add at least ${POLL_MIN_OPTIONS} options.`,
    POLL_TOO_MANY_OPTIONS: `You can add up to ${POLL_MAX_OPTIONS} options.`,
    POLL_OPTION_REQUIRED: "Please fill in every option.",
    POLL_OPTION_TOO_LONG: `Options can be up to ${POLL_OPTION_MAX} characters.`,
    POLL_OPTION_DUPLICATED: "Options can't repeat.",
    ANSWER_REQUIRED: "Please enter an answer.",
    ANSWER_TOO_LONG: `Answers can be up to ${ANSWER_MAX} characters.`,
    QUESTION_NOT_FOUND: "Question not found.",
    QUESTION_SUBMIT_FAILED: "Couldn't post the question. Please try again.",
    QUESTION_DELETE_FORBIDDEN: "You can only delete your own questions.",
    QUESTION_DELETE_FAILED: "Couldn't delete. Please try again.",
    ANSWER_SUBMIT_FAILED: "Couldn't post the answer. Please try again.",
    ANSWER_NOT_FOUND: "Answer not found.",
    ANSWER_DELETE_FORBIDDEN: "You can only delete your own answers.",
    ANSWER_DELETE_FAILED: "Couldn't delete. Please try again.",
    NAME_REQUIRED: "Please enter a nickname.",
    NAME_TOO_SHORT: `Nickname must be at least ${NAME_MIN} characters.`,
    NAME_TOO_LONG: `Nickname can be up to ${NAME_MAX} characters.`,
    IMAGE_TYPE_INVALID: "Only JPG, PNG, and WebP images are allowed.",
    IMAGE_TOO_LARGE: "Images can be up to 2MB.",
    PROFILE_UPDATE_FAILED: "Couldn't save your profile. Please try again.",
  },

  category: {
    korea: "Korean culture",
    japan: "Japanese culture",
    career: "Career / study",
    love: "Relationships",
    travel: "Travel",
    food: "Food",
    hobby: "Hobbies",
    free: "Anything else",
  },

  time: {
    locale: "en-US",
    justNow: "Just now",
    yesterday: "Yesterday",
    minutesAgo: (n: number) => `${n}m ago`,
    hoursAgo: (n: number) => `${n}h ago`,
    daysAgo: (n: number) => `${n}d ago`,
  },
};
