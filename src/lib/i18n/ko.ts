import { ANSWER_MAX } from "@/lib/answer-rules";
import type { CategoryId } from "@/lib/categories";
import type { FormErrorCode } from "@/lib/form-errors";
import type { NotificationType } from "@/types/notification";
import { NAME_MAX, NAME_MIN } from "@/lib/profile-rules";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";

export const ko = {
  meta: {
    title: "HanQ",
    socialTitle: "HanQ — 한국과 일본, 언어 걱정 없이",
    description:
      "한국어로 물으면 일본어로, 일본어 답변은 한국어로 자동 번역되는 한일 Q&A 커뮤니티. 문화·여행·취업·연애까지 현지 사람에게 직접 물어보세요.",
    keywords: [
      "한일 커뮤니티",
      "한국 일본 질문",
      "실시간 번역",
      "자동 번역 Q&A",
      "일본 문화",
      "일본 여행",
      "일본 유학",
      "일본 취업",
      "일본어 질문",
      "한일 교류",
    ],
  },

  common: {
    retry: "다시 시도",
    cancel: "취소",
    delete: "삭제",
    deleting: "삭제 중",
    submit: "등록",
    submitting: "등록 중",
    loadingQuestions: "질문을 불러오는 중",
    translating: "번역 중",
    fallbackUserName: "사용자",
  },

  nav: {
    home: "홈",
    profile: "내 정보",
    askAria: "질문 작성",
    back: "뒤로",
    close: "닫기",
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
    menuAria: "내 정보 메뉴",
    logout: "로그아웃",
    editProfile: "프로필 수정",
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
    loginToAnswer: "로그인하고 답변 남기기",
    showOriginal: "원문 보기",
    showTranslation: "번역 보기",
    likeAria: (count: number) => `좋아요 ${count}개`,

  },

  profile: {
    editTitle: "프로필 수정",
    photoLabel: "프로필 사진",
    photoChange: "사진 변경",
    photoRemove: "사진 삭제",
    nameLabel: "닉네임",
    namePlaceholder: "2~20자로 입력해 주세요",
    save: "저장",
    saving: "저장 중...",
    tabQuestions: "작성한 질문",
    tabAnswers: "작성한 답변",
    linkAria: (name: string) => `${name}님의 프로필 보기`,
  },

  deletion: {
    question: {
      menuAria: "질문 메뉴",
      title: "이 질문을 삭제할까요?",
      description: "달린 답변과 좋아요도 함께 사라져요. 되돌릴 수 없어요.",
    },
    answer: {
      menuAria: "답변 메뉴",
      title: "이 답변을 삭제할까요?",
      description: "되돌릴 수 없어요.",
    },
  },

  notification: {
    title: "알림",
    bellAria: "알림",
    unreadAria: "읽지 않은 알림 있음",
    empty: "아직 알림이 없어요.",
    message: {
      answer: (name: string) => `${name}님이 답변을 남겼어요`,
      "question-like": (name: string) => `${name}님이 내 질문을 좋아해요`,
      "answer-like": (name: string) => `${name}님이 내 답변을 좋아해요`,
    } satisfies Record<NotificationType, (name: string) => string>,
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
    QUESTION_DELETE_FORBIDDEN: "내가 쓴 질문만 삭제할 수 있어요.",
    QUESTION_DELETE_FAILED: "삭제에 실패했어요. 다시 시도해 주세요.",
    ANSWER_SUBMIT_FAILED: "답변 등록에 실패했어요. 다시 시도해 주세요.",
    ANSWER_NOT_FOUND: "답변을 찾을 수 없어요.",
    ANSWER_DELETE_FORBIDDEN: "내가 쓴 답변만 삭제할 수 있어요.",
    ANSWER_DELETE_FAILED: "삭제에 실패했어요. 다시 시도해 주세요.",
    NAME_REQUIRED: "닉네임을 입력해 주세요.",
    NAME_TOO_SHORT: `닉네임은 ${NAME_MIN}자 이상이어야 해요.`,
    NAME_TOO_LONG: `닉네임은 ${NAME_MAX}자까지 쓸 수 있어요.`,
    IMAGE_TYPE_INVALID: "JPG, PNG, WebP 이미지만 올릴 수 있어요.",
    IMAGE_TOO_LARGE: "이미지는 2MB까지 올릴 수 있어요.",
    PROFILE_UPDATE_FAILED: "프로필 저장에 실패했어요. 다시 시도해 주세요.",
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
