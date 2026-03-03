# Schooduler

Schooduler는 학급 주간 시간표를 빠르게 만들고 관리할 수 있는 웹 서비스입니다.  
교시별 수업 배치, 점심 시간 반영, 특별 활동 기록, JSON 백업/복원을 한 화면에서 처리할 수 있습니다.
데모: https://schooduler.vercel.app/

## 주요 기능

- 주간 시간표 편집: 월-금, 1-6교시 셀을 클릭해서 과목을 입력/수정
- 과목 칩 관리: 등록된 과목을 색상과 함께 관리하고 드래그 앤 드롭으로 셀에 배치
- 수업 시간 커스터마이징: 1교시 시작 시각, 수업/쉬는/점심 시간을 설정
- 특별 활동 타임라인: 요일/시작/종료 시각 기반으로 활동 추가 및 삭제
- 다국어 UI: 한국어/영어 전환 지원
- 데이터 백업: JSON 내보내기/불러오기 및 전체 초기화
- 자동 저장: 브라우저 로컬 스토리지(`simple-timetable-v1`)에 상태를 유지

## 빠른 시작

### 1) 설치

```bash
pnpm install
```

### 2) 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`에 접속하면 됩니다.

## 사용 흐름

1. 상단에서 언어를 선택하고, 필요하면 시간표 제목을 클릭해 수정합니다.
2. 좌측 설정 패널에서 교시/쉬는시간/점심 시간을 맞춥니다.
3. 시간표 셀을 눌러 과목을 입력하거나, 우측 과목 칩을 드래그해 배치합니다.
4. 특별 활동을 추가하면 하단 타임라인에서 확인할 수 있습니다.
5. 상단 `불러오기/내보내기/초기화`로 데이터를 관리합니다.

## 개발 명령어

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 빌드 결과 실행
- `pnpm lint`: ESLint 검사
- `pnpm test`: Vitest 단일 실행
- `pnpm test:watch`: Vitest 감시 모드

## 기술 스택

- Next.js (App Router), React, TypeScript
- Zustand + persist(localStorage)
- Tailwind CSS
- Vitest + Testing Library
