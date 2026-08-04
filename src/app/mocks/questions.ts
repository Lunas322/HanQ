
export type Language = "ko" | "ja";

export type User = {
  name: string;
  languages: Language;
};

export type Question = {
  id: string;
  user: User;
  content: string;
  likeCount: number;
  commentCount: number;
  time: string;
  categoryId: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    user: { name: "유리", languages: "ja" },
    content: "일본 대학생들은 보통 아르바이트를 하나요?",
    likeCount: 2,
    commentCount: 4,
    time: "3분 전",
    categoryId: "hobby",
  },
  {
    id: "q2",
    user: { name: "김민준", languages: "ko" },
    content: "오사카에서 한 달 살기 하려는데 월세 시세가 어느 정도인가요?",
    likeCount: 47,
    commentCount: 12,
    time: "1시간 전",
    categoryId: "travel",
  },
  {
    id: "q3",
    user: { name: "사토", languages: "ja" },
    content: "한국 회사 면접에서 자기소개는 몇 분 정도가 적당한가요?",
    likeCount: 0,
    commentCount: 0,
    time: "2시간 전",
    categoryId: "job",
  },
  {
    id: "q4",
    user: { name: "박서연", languages: "ko" },
    content:
      "일본에서 친구 집에 초대받았을 때 손에 뭘 들고 가야 실례가 아닐까요? 한국이면 보통 과일이나 음료를 사 가는데, 일본도 비슷한 문화가 있는지 궁금해요. 아니면 아예 안 가져가는 게 더 자연스러운 건가요?",
    likeCount: 128,
    commentCount: 34,
    time: "5시간 전",
    categoryId: "culture",
  },
  {
    id: "q5",
    user: { name: "たなか ゆうすけ", languages: "ja" },
    content: "한국어 존댓말은 언제부터 반말로 바꿔도 되나요?",
    likeCount: 9,
    commentCount: 3,
    time: "어제",
    categoryId: "language",
  },
  {
    id: "q6",
    user: { name: "이도현", languages: "ko" },
    content: "편의점 오뎅 국물은 무료인가요?",
    likeCount: 1,
    commentCount: 1,
    time: "2일 전",
    categoryId: "food",
  },
];
