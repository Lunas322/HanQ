import type { Language } from "./questions";

// 아바타 배경/글자색 조합. Tailwind 클래스를 여기 두지 않는 이유는
// 목데이터가 스타일을 모르게 하기 위해서다. 매핑은 화면 쪽에서 한다.
export type AvatarColor = "blue" | "purple" | "red" | "green";

export type Answer = {
  id: string;
  questionId: string;
  author: {
    id: string;
    name: string;
    language: Language;
    avatarColor: AvatarColor;
  };
  content: string;
  likeCount: number;
  liked: boolean;
  time: string;
};

export function findAnswers(questionId: string) {
  return ANSWERS.filter((answer) => answer.questionId === questionId);
}

export const ANSWERS: Answer[] = [
  {
    id: "a1",
    questionId: "q1",
    author: { id: "u7", name: "ケンジ", language: "ja", avatarColor: "purple" },
    content:
      "네, 정말 많이 해요! 저도 대학교 1학년 때부터 편의점에서 일했어요. 도쿄는 시급이 보통 1,100엔 정도예요.",
    likeCount: 8,
    liked: true,
    time: "2분 전",
  },
  {
    id: "a2",
    questionId: "q1",
    author: { id: "u8", name: "さとみ", language: "ja", avatarColor: "red" },
    content:
      "학비랑 생활비를 스스로 버는 학생이 많아서 아르바이트는 거의 필수 같은 느낌이에요.",
    likeCount: 3,
    liked: false,
    time: "1분 전",
  },
  {
    id: "a3",
    questionId: "q1",
    author: { id: "u9", name: "ゆか", language: "ja", avatarColor: "green" },
    content:
      "카페, 편의점, 이자카야가 제일 흔해요. 방학 때는 리조트 바이트도 인기가 많아요!",
    likeCount: 1,
    liked: false,
    time: "방금",
  },
  {
    id: "a4",
    questionId: "q2",
    author: { id: "u10", name: "타나카", language: "ja", avatarColor: "blue" },
    content:
      "난바 쪽 원룸이면 6~8만엔 정도 봐요. 단기는 조금 더 비싸고, 관리비가 5천엔쯤 따로 붙는 경우가 많아요.",
    likeCount: 12,
    liked: false,
    time: "40분 전",
  },
  {
    id: "a5",
    questionId: "q3",
    author: { id: "u11", name: "박지훈", language: "ko", avatarColor: "green" },
    content:
      "1분 30초에서 2분 사이가 무난해요. 너무 길면 오히려 정리가 안 된 인상을 줍니다.",
    likeCount: 5,
    liked: false,
    time: "1시간 전",
  },
  {
    id: "a6",
    questionId: "q2",
    author: { id: "u1", name: "유리", language: "ko", avatarColor: "blue" },
    content:
      "저도 작년에 우메다에서 한 달 살았어요. 단기는 시세가 확 뛰니까 먼스리 맨션 사이트를 먼저 보는 걸 추천해요.",
    likeCount: 6,
    liked: false,
    time: "30분 전",
  },
  {
    id: "a7",
    questionId: "q4",
    author: { id: "u1", name: "유리", language: "ko", avatarColor: "blue" },
    content:
      "저는 백화점 지하에서 파는 과자 세트를 자주 사 갔어요. 2~3천엔이면 부담 없이 받아주시더라고요.",
    likeCount: 21,
    liked: false,
    time: "3시간 전",
  },
];
