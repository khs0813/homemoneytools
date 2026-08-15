# 집계산 - 부동산·주거비 계산기

Next.js App Router 기반 계산기 사이트입니다.

## 포함 계산기

- 전세대출 이자 계산기
- 월세 vs 전세 비교 계산기
- 주택담보대출 DSR 계산기
- 취득세 계산기
- 부동산 중개수수료 계산기
- 월세 환산 계산기
- 청약 가점 계산기

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Vitest

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트 및 전체 점검

```bash
npm run test
npm run check
```

## 빌드

```bash
npm run build
npm run start
```

`npm run build`는 Next.js 정적 export를 수행해 `out/`을 생성합니다. `npm run start`는 `out/`을 일반 정적 HTTP 서버로 서빙하며, Next.js 서버 프로세스(`next start`)를 사용하지 않습니다.

## Render Static Site 배포

이 저장소는 Render Web Service가 아니라 Render Static Site로 배포합니다.

Dashboard 최종 설정:

- Service Type: Static Site
- Build Command: `npm ci && npm run build`
- Publish Directory: `out`
- Node version: `20.19.0`
- Runtime: Static
- 서버 Start Command: 없음

`render.yaml`을 Blueprint로 사용할 경우 Static Site는 `type: web`, `runtime: static`, `staticPublishPath: out` 조합을 사용합니다. Next.js 정적 export는 페이지별 HTML을 생성하므로 `/* -> /index.html` 같은 SPA 전역 rewrite를 추가하지 않습니다.

필수 redirect rule:

- `/severance-pay-calculator` -> `https://www.moneycalculator.co.kr/severance-pay-calculator`
- `/guides/acquisition-tax` -> `/guides/acquisition-tax-checklist`
- `/guides/brokerage-fee` -> `/guides/brokerage-fee-negotiation`
- `/guides/dsr` -> `/guides/what-dsr-40-means`
- `/guides/jeonse-loan-interest` -> `/guides/jeonse-loan-interest-mistakes`
- `/guides/monthly-rent-conversion` -> `/guides/monthly-rent-conversion-basics`
- `/guides/rent-vs-jeonse` -> `/guides/rent-vs-jeonse-decision-guide`
- `/guides/subscription-score` -> `/guides/subscription-score-interpretation`

운영 전환 순서:

1. 같은 저장소/브랜치로 Render Static Site를 생성하거나 기존 Static Site 설정을 갱신합니다.
2. `NEXT_PUBLIC_SITE_URL`과 기존 Kakao AdFit 환경변수를 등록합니다.
3. Build Command를 `npm ci && npm run build`, Publish Directory를 `out`으로 설정합니다.
4. 임시 `onrender.com` 주소에서 `npm run static:verify -- --base https://임시주소`에 준하는 전체 경로 검증을 수행합니다.
5. 검증 후에만 `jipcalc.co.kr`과 `www.jipcalc.co.kr`을 새 Static Site에 연결합니다.
6. `jipcalc.co.kr`을 기본 도메인으로 사용하고 `www`는 루트 도메인으로 리디렉션되게 설정합니다.
7. Render 화면에 표시되는 최신 DNS 값을 사용하고, 코드나 문서에 과거 IP를 하드코딩하지 않습니다.
8. 새 Static Site 검증이 끝나기 전에는 기존 운영 서비스를 삭제하지 않습니다.

정적 export 감사 기준선:

- 패키지 매니저: npm, lockfile: `package-lock.json`
- 주요 버전: Next.js `16.2.6`, React `19.2.6`, Node `20.19.0`
- App Router indexable URL: 42개 (`/`, 정책/목록 7개, 계산기 16개, 가이드 18개)
- 정적 전환 전 차단 요인: `next.config.ts`의 서버 header/redirect, 가이드 alias의 `permanentRedirect`, 동적 표시된 `/rss.xml` Route Handler, Render Node Web Service 설정
- 계산기는 Client Component에서 동작하며 별도 DB/API/Server Action을 사용하지 않습니다.

## 환경변수

```text
NEXT_PUBLIC_SITE_URL=https://실제도메인
NEXT_TELEMETRY_DISABLED=1
GOOGLE_SITE_VERIFICATION=Search Console 인증값
NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY=true
NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT=true
NEXT_PUBLIC_ADFIT_ENABLE_END=true
NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL=true
NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE=Render에 등록
NEXT_PUBLIC_ADFIT_MOBILE_BANNER=Render에 등록
NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER=Render에 등록
NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER=Render에 등록
NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP=Render에 등록
```

정적 사이트의 `NEXT_PUBLIC_*` 값은 build 시점에 번들에 포함됩니다. 환경변수 값을 변경한 뒤에는 반드시 새 build/deploy를 실행해야 합니다. Kakao AdFit DAN ID는 저장소에 커밋하지 않고 Render Environment에만 등록합니다.

## 중요 안내

취득세율, 중개보수 요율, DSR 기준, 청약가점 기준은 `/src/config`에 분리되어 있습니다. 법령과 금융기관 심사 기준은 변경될 수 있으므로 실제 서비스 전 최신 기준으로 검수하세요.

이 프로젝트의 계산 결과는 참고용이며 실제 세금, 대출 가능 금액, 청약가점, 중개보수와 다를 수 있습니다.

## 추가 문서

- `SECURITY.md`: 보안 점검 및 운영 정책
- `SEO.md`: 배포 후 SEO 체크리스트
