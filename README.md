# HanQ (한큐)

**한국과 일본을 잇는 실시간 번역 Q&A 서비스.**
한국어로 질문을 올리면 일본 사용자에게는 일본어로 보이고, 일본어로 올리면 한국 사용자에게는 한국어로 보인다. 사용자는 번역을 의식하지 않고 각자의 모국어로만 읽고 쓴다.

---

## 주요 기능

### 1. 질문·답변 자동 번역

질문과 답변은 작성 즉시 백그라운드에서 DeepL API를 통해 번역되어 **언어별로 함께 저장된다.** 조회 시점에 번역하지 않기 때문에 읽기 속도에 영향이 없다.

- 작성 언어를 자동 감지하고 반대 언어로 번역
- 번역이 끝나기 전에는 "번역 중" 배지를 노출
- 원문/번역 전환 토글 제공 — 번역이 어색할 때 원문을 직접 확인할 수 있다

### 2. ko / ja 다국어 라우팅

모든 화면이 `/[lang]` 세그먼트 아래에 있고, 미들웨어가 접속자의 언어를 판별해 해당 경로로 보낸다.

판별 우선순위:
1. 사용자가 직접 고른 언어 (쿠키)
2. 접속 국가 (`x-vercel-ip-country` → KR은 한국어, JP는 일본어)
3. 기본값 한국어

언어 판별 결과는 요청 헤더로 서버 컴포넌트까지 전달되어, UI 문구 사전(`ko.ts` / `ja.ts`)과 데이터 조회에 동일하게 적용된다.

### 3. 질문 상호작용

좋아요, 답변 작성, 삭제, 알림. 좋아요와 탭 전환은 낙관적 업데이트(optimistic update)로 즉시 반영되고, 내 질문에 답변이 달리거나 좋아요를 받으면 알림이 쌓인다.

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 데이터 | Firebase Firestore (Admin SDK) |
| 인증 | Firebase Auth + 세션 쿠키 |
| 파일 저장 | Firebase Storage |
| 번역 | DeepL API |
| 배포 | Vercel |

---

## 기술적으로 신경 쓴 것

### 태그 기반 캐싱

Firestore 조회를 시간 기준(`revalidate`)이 아니라 **캐시 태그** 기준으로 무효화한다. 글이 새로 올라오거나 수정되면 관련 태그만 무효화되므로, 변경이 없는 동안에는 캐시가 계속 유효하고 변경 즉시 반영된다.

```
questions            질문 목록
question:{id}        질문 상세
answers:{id}         특정 질문의 답변 목록
users                작성자 정보
```

### 서버 컴포넌트 우선

데이터 조회는 서버 컴포넌트에서 처리하고, `'use client'`는 상호작용이 필요한 잎사귀 컴포넌트로 밀어냈다. 폼 제출은 Server Actions를 사용해 별도 API 라우트 없이 처리한다.

### 로딩·에러 상태

각 라우트에 `loading.tsx`를 두어 스켈레톤을 노출하고, `error.tsx`와 `global-error.tsx`로 에러 바운더리를 구성했다. 에러는 코드로 반환되어 사용자 언어에 맞는 문구로 변환된다.

### SEO / GEO

- `sitemap.xml`, `robots.txt`, `llms.txt` 제공
- 질문 상세에 `QAPage` 구조화 데이터 삽입
- 동적 OG 이미지 생성 (`opengraph-image.tsx`)
- 로그인 전용 화면은 색인에서 제외

---

## 프로젝트 구조

```
src/
├── app/
│   ├── [lang]/           언어 세그먼트 아래의 모든 화면
│   │   ├── home/         질문 목록
│   │   ├── detail/[id]/  질문 상세 + 답변
│   │   ├── ask/          질문 작성
│   │   ├── my/           내 정보
│   │   ├── users/[id]/   사용자 프로필
│   │   ├── profile/edit/ 프로필 수정
│   │   └── notifications/알림
│   ├── api/session/      세션 쿠키 발급·삭제
│   └── components/       공용 UI 컴포넌트
├── lib/
│   ├── i18n/             ko / ja 사전, 언어 컨텍스트
│   ├── questions.ts      질문 데이터 계층
│   ├── answers.ts        답변 데이터 계층
│   ├── translate.ts      DeepL 클라이언트
│   ├── cache-tags.ts     캐시 태그 정의
│   └── firebase-admin.ts Firestore Admin 초기화
├── types/                도메인 타입
└── middleware.ts         언어 판별 + 라우트 보호
```
