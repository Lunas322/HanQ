
export type Language = "ko" | "ja";

export type User = {
  id: string;
  name: string;
  languages: Language;
};

export type Question = {
  id: string;
  user: User;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  time: string;
  categoryId: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    user: { id: "u1", name: "유리", languages: "ja" },
    title: "일본 대학생들은 보통 아르바이트를 하나요?",
    content:
      "한국은 대학생 대부분이 카페나 편의점에서 알바를 해요. 일본도 비슷한 분위기인지 궁금합니다. 주로 어떤 업종에서 많이 하는지, 시급은 어느 정도인지 알려주세요.",
    likeCount: 2,
    commentCount: 4,
    time: "3분 전",
    categoryId: "career",
  },
  {
    id: "q2",
    user: { id: "u2", name: "김민준", languages: "ko" },
    title: "오사카에서 한 달 살기 하려는데 월세 시세가 어느 정도인가요?",
    content:
      "8월에 한 달 정도 오사카에 머물 예정입니다. 난바나 우메다 근처 원룸을 보고 있는데 단기 임대라 시세 감이 전혀 없어요. 월세 말고 보증금이나 관리비가 따로 붙는지도 같이 알려주시면 감사하겠습니다.",
    likeCount: 47,
    commentCount: 12,
    time: "1시간 전",
    categoryId: "travel",
  },
  {
    id: "q3",
    user: { id: "u3", name: "사토", languages: "ja" },
    title: "한국 회사 면접에서 자기소개는 몇 분 정도가 적당한가요?",
    content:
      "다음 주에 서울에 있는 IT 회사 면접을 봅니다. 일본에서는 1분 정도로 짧게 끝내는 게 보통인데, 한국은 더 길게 말해야 한다는 이야기를 들었어요. 실제 면접에서는 어느 정도 길이가 자연스러운가요?",
    likeCount: 0,
    commentCount: 0,
    time: "2시간 전",
    categoryId: "career",
  },
  {
    id: "q4",
    user: { id: "u4", name: "박서연", languages: "ko" },
    title: "일본에서 친구 집에 초대받았을 때 손에 뭘 들고 가야 실례가 아닐까요?",
    content:
      "한국이면 보통 과일이나 음료를 사 가는데, 일본도 비슷한 문화가 있는지 궁금해요. 아니면 아예 안 가져가는 게 더 자연스러운 건가요? 가져간다면 부담스럽지 않은 가격대가 어느 정도인지도 알고 싶습니다.",
    likeCount: 128,
    commentCount: 34,
    time: "5시간 전",
    categoryId: "japan",
  },
  {
    id: "q5",
    user: { id: "u5", name: "たなか ゆうすけ", languages: "ja" },
    title: "한국어 존댓말은 언제부터 반말로 바꿔도 되나요?",
    content:
      "한국인 친구와 반년 정도 알고 지냈는데 아직 서로 존댓말을 씁니다. 제가 먼저 반말하자고 제안해도 되는 건지, 아니면 나이가 많은 쪽이 먼저 말을 꺼내는 게 예의인지 헷갈려요.",
    likeCount: 9,
    commentCount: 3,
    time: "어제",
    categoryId: "korea",
  },
  {
    id: "q6",
    user: { id: "u6", name: "이도현", languages: "ko" },
    title: "편의점 오뎅 국물은 무료인가요?",
    content:
      "일본 편의점에서 오뎅을 샀는데 국물을 더 달라고 해도 되는지 몰라서 그냥 나왔어요. 한국은 보통 종이컵에 담아 주는데, 일본도 추가로 받을 수 있나요?",
    likeCount: 1,
    commentCount: 1,
    time: "2일 전",
    categoryId: "food",
  },
];
