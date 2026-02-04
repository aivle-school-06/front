# PRD: SENTINEL (Target Version)

## 1. 제품 개요
SENTINEL은 기업/협력사 리스크를 통합 분석하고, 분기별 위험 분포 및 예측 지표를 기반으로 조기 경보를 제공하는 리스크 모니터링 플랫폼이다. 관리자/사용자는 역할 기반으로 정보 탐색과 Q&A 협업을 수행한다.

## 2. 문제 정의
리스크 신호가 분산되어 있고 사후 대응 중심이기 때문에, 기업은 위험 징후를 조기에 포착하기 어렵다. 신뢰 가능한 통합 지표/예측/설명 기반의 의사결정 지원이 필요하다.

## 3. 목표
1. 리스크 상태 분포와 트렌드를 한 눈에 보여준다.
2. 기업 단위 예측 지표 및 AI 코멘트를 제공해 조기 대응을 가능하게 한다.
3. Q&A를 통해 운영/관리 커뮤니케이션을 단축한다.
4. 신규 기업 등록 및 분석 요청 흐름을 자동화한다.

## 4. 사용자 및 권한
1. USER: 기업 담당자, 질문 등록 및 기업 조회
2. ADMIN: 운영/분석 관리자, 공지/답변/감시

## 5. 사용자 시나리오
1. 로그인 → 대시보드 → 위험 분포 및 KPI 확인
2. 협력사 목록 → 검색/필터 → 기업 상세 확인
3. 기업 상세 → 예측 지표/신호등/AI 코멘트 확인
4. 기업 추가 → 검색/선택 → confirm → PROCESSING 대기 → 완료 결과 조회
5. Q&A 질문 등록 → 관리자 답변 수신
6. 관리자: 공지 조회/배포 및 질문자/질문 관리

## 6. 기능 요구사항 (Target)
1. 인증
1. 로그인/회원가입/로그아웃, 토큰 갱신 지원
1. 역할 기반 UI 분기(ADMIN/USER)
1. Turnstile 검증(회원가입)
2. 대시보드
1. KPI 카드 표시
1. 위험 분포(낮음/주의/높음) 및 분기별 트렌드
1. 분기 기준: 최신 실제 4개 분기 + 1개 예측 분기
3. 협력사 목록
1. 검색/필터(기업명, 섹터 등)
1. 리스트 + Quick View
4. 협력사 상세
1. 위험 상태, 핵심 지표, 신호등
1. 예측 차트(실측/예측 구분 시각화)
1. AI 코멘트
5. 기업 추가
1. 검색 → 선택 → confirm
1. PROCESSING 상태일 경우 진행 안내 + 재조회/폴링
1. 완료 시 상세 결과 반환
6. 의사결정룸
1. Strategic Bulletin(활성/아카이브)
1. Q&A: 작성/조회/검색/필터
1. 관리자 답변 등록 + 상태 변경(pending → answered)

## 7. 데이터/API 연동 (Target)
1. Auth
1. `POST /auth/login`
1. `POST /auth/logout`
1. `GET /auth/me`
1. `POST /auth/signup`
1. `POST /auth/refresh`
2. Dashboard
1. `GET /dashboard/summary`
3. Companies
1. `GET /companies/search`
1. `POST /companies/confirm`
1. `GET /companies/{companyId}/overview`
1. `POST /companies/{companyId}/update-requests`
4. Q&A
1. `GET /api/posts`
1. `POST /api/posts`
1. `PATCH /api/posts/{id}`
1. `DELETE /api/posts/{id}`
1. (관리자 답변) `/decision-room/qa/{postId}/replies` 또는 동등 스펙 추가 필요

## 8. 지표 및 성공 기준
1. MAU / DAU
2. 협력사 상세 페이지 방문률
3. Q&A 평균 응답 시간
4. 기업 등록 완료율
5. API 성공률/평균 응답 시간

## 9. 비기능 요구사항
1. 페이지 로딩: 주요 화면 2초 이내(목표)
2. 데이터 오류 시 재시도 UI 제공
3. 에러 메시지 표준화

## 10. 리스크 및 의존성
1. Q&A 관리자 답변 API 스펙 확정 필요
2. PROCESSING 상태 처리(폴링/웹훅) 결정 필요
3. 데이터 스키마 확정 전 UI 불일치 가능성

## 11. 오픈 이슈
1. 관리자 답변 등록 API 스펙 확정일
2. PROCESSING 완료 시 자동/수동 재조회 정책
3. KPI 최소 필수 항목 확정
