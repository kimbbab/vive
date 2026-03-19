# 바이브코딩 사례 발표 자료

이 폴더는 세 부분으로 나뉩니다.

- `index.html`: 발표용 메인 웹페이지
- `content/`: 발표 내용과 예상 질문 데이터
- `qna/`: 휴대폰 질문 게시판

## 수정하기 쉬운 구조

발표 자료는 계속 추가하거나 디자인을 바꿀 수 있게 분리했습니다.

- 내용 추가: `content/presentation-data.js`
- 예상 질문 답변 수정: `content/qna-bank.js`
- 발표 웹 디자인 수정: `styles/main.css`
- 질문 게시판 디자인 수정: `qna/styles.css`

레이아웃 파일은 그대로 두고, 데이터와 스타일만 바꿔도 대부분 수정할 수 있습니다.

## 발표 웹

브라우저에서 `index.html`을 열면 발표 자료가 보입니다.

- 왼쪽 고정 메뉴로 섹션 이동
- 사례 카드 클릭 시 상세 내용 모달 열기
- 질문 게시판으로 바로 이동 가능

GitHub Pages 배포용 워크플로가 포함되어 있어 `main` 브랜치에 푸시하면 자동 배포됩니다.
기본 주소는 `https://kimbbab.github.io/vive/` 입니다.

## 질문 게시판

브라우저에서 `qna/index.html`을 열면 질문 게시판이 보입니다.

- 일반 모드: 질문 등록 + 질문 목록
- 발표자 모드: `qna/?mode=presenter`
- 발표자 모드에서는 GPT 모범답안과 발표자 메모 표시

기본값은 `localStorage` 저장이라 Supabase 없이도 테스트 가능합니다.

## Supabase 연결

`qna/supabase-config.example.js`의 값을 실제 값으로 채우면 Supabase를 사용합니다.
처음 연결할 때는 [qna/supabase-schema.sql](/C:/Users/bab/vive_/발표/qna/supabase-schema.sql)의 SQL을 실행해 테이블을 먼저 만듭니다.

예시 테이블 컬럼:

- `id`
- `author`
- `content`
- `created_at`
- `status`
- `model_answer`
- `speaker_note`

권장 테이블명은 `questions`입니다.

## 발표 전에 하면 좋은 일

- 실제 사례 링크와 캡처를 더 추가하기
- 예상 질문 모범답안을 회사 분위기에 맞게 늘리기
- 질문 게시판 링크용 QR 만들기
- Supabase 연결 후 휴대폰 2대로 등록/조회 테스트
