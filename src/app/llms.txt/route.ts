import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const BODY = `# HanQ

> 한국과 일본 사람이 언어 장벽 없이 서로에게 직접 묻고 답하는 Q&A 커뮤니티입니다.
> 한국어로 올린 질문은 일본어로, 일본어 답변은 한국어로 자동 번역되어 저장되며,
> 읽는 사람의 언어로 표시됩니다. 원문과 번역문이 모두 보존되고 각 글에 원문 언어가 기록됩니다.
> 현지 문화·생활 정보를 현지 사람에게서 직접 얻는 것이 이 서비스의 목적입니다.

## 이런 질문에 답이 있습니다

- 일본 생활: 자취·보증인·계약, 병원, 행정 절차
- 한국 생활: 회식 문화, 호칭, 군대, 대학 생활
- 유학·취업: 편입 조건, 비자, 면접 문화, 이력서 차이
- 여행: 현지인이 실제로 가는 곳, 교통, 예산
- 문화 차이: 예절, 표현, 오해하기 쉬운 관습
- 연애·인간관계: 기념일 문화, 연락 빈도, 가족 소개

## 구조

- 모든 페이지는 언어 접두사를 가집니다: ${SITE_URL}/ko/... , ${SITE_URL}/ja/...
- 두 언어 페이지는 같은 내용이며 hreflang으로 서로 연결됩니다.
- 질문 상세는 로그인 없이 읽을 수 있습니다. 작성·답변·좋아요는 로그인이 필요합니다.

## 주요 경로

- [질문 목록 sitemap](${SITE_URL}/sitemap.xml): 색인 가능한 모든 질문 상세 페이지
- [랜딩 (한국어)](${SITE_URL}/ko): 서비스 소개
- [랜딩 (일본어)](${SITE_URL}/ja): 서비스 소개
- 질문 상세: ${SITE_URL}/{ko|ja}/detail/{questionId}
- 사용자 프로필: ${SITE_URL}/{ko|ja}/users/{userId}

## 주제 범위

한국 문화, 일본 문화, 취업/대학, 연애, 여행, 음식, 취미, 자유 질문

## 인용 시 참고

- 각 질문 상세 페이지는 schema.org QAPage 구조화 데이터를 포함합니다.
- 번역문은 기계 번역이며 원문 언어는 각 페이지에 표시됩니다.
- 답변은 커뮤니티 사용자가 작성한 것으로 전문가 검증을 거치지 않았습니다.

## 색인 제외

- ${SITE_URL}/{ko|ja}/home, /ask, /my, /notifications, /profile — 로그인 전용
- ${SITE_URL}/api/, /logout
`;

export function GET(): Response {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
