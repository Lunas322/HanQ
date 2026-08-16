import { ANSWER_MAX } from "@/lib/answer-rules";
import type { CategoryId } from "@/lib/categories";
import type { FormErrorCode } from "@/lib/form-errors";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";

export const ko = {
  meta: {
    title: "HanQ — 언어 걱정 없이 한국과 일본에 물어보세요",
    description:
      "내 언어로 쓰면 상대 언어로 자동 번역되는 한일 Q&A 커뮤니티",
  },

  common: {
    retry: "다시 시도",
    submit: "등록",
    submitting: "등록 중",
    loadingQuestions: "질문을 불러오는 중",
    fallbackUserName: "사용자",
  },

  nav: {
    home: "홈",
    profile: "내 정보",
    askAria: "질문 작성",
  },

  language: {
    switcherLegend: "표시 언어",
    ko: "한국어",
    ja: "日本語",
  },

  country: {
    ko: "한국",
    ja: "일본",
  },

  landing: {
    heroLine1: "언어 걱정 없이,",
    heroLine2: "한국과 일본에",
    heroLine3: "물어보세요",
    heroDescriptionLine1: "내 언어로 쓰면 상대 언어로 자동 번역돼요.",
    heroDescriptionLine2: "문화, 여행, 취업까지 궁금한 걸 편하게 나눠요.",
    popularHeading: "지금 올라온 인기 질문",
    login: "Google로 3초 만에 시작하기",
    loggingIn: "로그인 중...",
    terms: "가입하면 이용약관과 개인정보 방침에 동의하게 돼요",
    loginFailed: "로그인에 실패했어요. 다시 시도해 주세요.",
    sessionFailed: "세션 생성에 실패했습니다.",
  },

  home: {
    tabLatest: "최신",
    tabPopular: "인기",
    allCategories: "전체",
    emptyAll: "아직 등록된 질문이 없어요.",
    emptyFiltered: "선택한 카테고리에 아직 질문이 없어요.",
  },

  my: {
    tabQuestions: "내 질문",
    tabAnswers: "내 답변",
    emptyQuestions: "아직 작성한 질문이 없어요.",
    emptyAnswers: "아직 답변한 질문이 없어요.",
    stats: (questions: number, answers: number, likes: number) =>
      `질문 ${questions} · 답변 ${answers} · 받은 좋아요 ${likes}`,
  },

  ask: {
    headerTitle: "질문하기",
    titleLabel: "제목",
    titlePlaceholder: "무엇이 궁금한가요?",
    contentLabel: "내용",
    contentPlaceholder:
      "한국과 어떤 점이 다른지, 배경도 함께 적어주면 좋아요",
    categoryLegend: "카테고리",
    translationNotice:
      "작성한 글은 일본어로 자동 번역돼서 함께 보여져요. 원문도 그대로 저장돼요.",
    submit: "질문 등록하기",
    submitting: "등록 중...",
  },

  detail: {
    headerTitle: "질문",
    answersHeading: "답변",
    emptyAnswers: "아직 답변이 없어요. 첫 답변을 남겨보세요.",
    answerInputLabel: "답변 입력",
    answerPlaceholder: "따뜻한 답변을 남겨보세요",
    showOriginal: "원문 보기",
    showTranslation: "번역 보기",
    likeAria: (count: number) => `좋아요 ${count}개`,
  },

  error: {
    pageTitle: "화면을 불러오지 못했어요",
    pageDescription: "잠시 후 다시 시도해 주세요. 계속 안 되면 새로고침해 주세요.",
    digest: (code: string) => `오류 코드 ${code}`,
    globalTitle: "문제가 발생했어요",
    globalDescription: "페이지를 다시 불러와 주세요.",
  },

  formError: {
    TITLE_REQUIRED: "제목을 입력해 주세요.",
    TITLE_TOO_LONG: `제목은 ${TITLE_MAX}자까지 쓸 수 있어요.`,
    CONTENT_REQUIRED: "내용을 입력해 주세요.",
    CONTENT_TOO_LONG: `내용은 ${CONTENT_MAX}자까지 쓸 수 있어요.`,
    CATEGORY_REQUIRED: "카테고리를 선택해 주세요.",
    ANSWER_REQUIRED: "답변을 입력해 주세요.",
    ANSWER_TOO_LONG: `답변은 ${ANSWER_MAX}자까지 쓸 수 있어요.`,
    QUESTION_NOT_FOUND: "질문을 찾을 수 없어요.",
    QUESTION_SUBMIT_FAILED: "질문 등록에 실패했어요. 다시 시도해 주세요.",
    ANSWER_SUBMIT_FAILED: "답변 등록에 실패했어요. 다시 시도해 주세요.",
  } satisfies Record<FormErrorCode, string>,

  category: {
    korea: "한국 문화",
    japan: "일본 문화",
    career: "취업 / 대학",
    love: "연애",
    travel: "여행",
    food: "음식",
    hobby: "취미",
    free: "자유 질문",
  } satisfies Record<CategoryId, string>,

  time: {
    locale: "ko-KR",
    justNow: "방금",
    yesterday: "어제",
    minutesAgo: (n: number) => `${n}분 전`,
    hoursAgo: (n: number) => `${n}시간 전`,
    daysAgo: (n: number) => `${n}일 전`,
  },
};

export type Dictionary = typeof ko;
