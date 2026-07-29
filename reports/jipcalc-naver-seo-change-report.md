# jipcalc.co.kr Naver SEO Commit A Change Report

작성일: 2026-07-29

## 1. 수정 파일 목록

| 구분 | 파일 | 이유 |
| --- | --- | --- |
| 날짜 메타데이터 | `src/config/content-metadata.json`, `src/config/content-metadata.ts` | 계산기와 가이드의 `datePublished`, `basisDate`, `dateModified`, `sourceCheckedAt` 단일 데이터 소스 추가 |
| 기존 날짜 중복 제거 | `src/config/guides.ts`, `src/config/calculators.ts`, `src/config/calculator-quality-content.ts` | `referenceDate`, `contentLastModified`, 품질 콘텐츠의 일괄 수정일 주입 제거 |
| JSON-LD/화면 날짜 | `src/lib/json-ld.tsx`, `src/components/content/GuidePage.tsx`, `src/components/calculator/GuideArticle.tsx`, `src/components/calculator/CalculatorPage.tsx` | 화면 표시, WebPage JSON-LD, Article JSON-LD가 통합 날짜를 사용하도록 변경 |
| legacy URL | `next.config.ts`, `src/app/severance-pay-calculator/page.tsx`, `src/components/calculators/SeverancePayCalculator.tsx`, `src/config/seo-content.ts`, `scripts/collect-seo-snapshot.mjs` | `/severance-pay-calculator` 자체 페이지 제거 및 정확한 대응 URL로 301 설정 |
| sitemap/RSS/robots | `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`, `src/app/robots.ts` | indexable canonical URL만 sitemap에 포함, RSS를 가이드 중심으로 정리, robots 허용/차단 범위 명시 |
| 내부 링크 | `src/config/related-links.ts`, `src/components/calculator/CalculatorPage.tsx`, `src/app/calculators/page.tsx` | 단순 키워드 나열을 실제 내부 링크로 교체하고 sitemap 계산기 고립 페이지 방지 |
| 자동 검사 | `scripts/seo-audit.mjs`, `package.json`, `tsconfig.json`, `next-env.d.ts` | `npm run build`에서 source SEO 감사 실행, HTTP SEO 감사 명령 추가, stale dev 타입 캐시 제외 |
| 회귀 테스트 | `src/tests/seo.test.ts`, `src/tests/loan.test.ts`, `src/tests/rent-conversion.test.ts`, `src/tests/dsr.test.ts`, `scripts/check-calculation-regression.mjs` | 날짜/legacy/RSS/sitemap 및 요청된 대표 계산값 검증 |
| 산출 보고서 | `reports/seo-audit.json`, `reports/seo-audit.md`, `docs/*-after.*`, `docs/calculation-regression-check.md`, `docs/mobile-layout-report.md` | SEO 감사, after 스냅샷, 계산 회귀, 모바일 레이아웃 결과 기록 |

## 2. 수정 전후 title/description

1차 배포 조건에 따라 핵심 title과 description은 변경하지 않았습니다. legacy 퇴직금 페이지는 자체 indexable 페이지에서 제거하고 301 대상으로 전환했습니다.

| URL | title 전 | title 후 | description 전 | description 후 |
| --- | --- | --- | --- | --- |
| `/jeonse-loan-interest-calculator` | 전세대출 이자 계산기 - 월 이자·총이자 계산 | 동일 | 전세보증금, 대출금액, 금리, 기간을 입력해 전세대출 월 이자와 총이자를 계산합니다. 1억·2억 전세대출 이자와 금리 상승 시나리오도 함께 확인하세요. | 동일 |
| `/monthly-rent-conversion-calculator` | 월세 전세 환산 계산기 - 보증금·월세 전환금액 계산 | 동일 | 보증금과 월세를 입력하면 전세 환산금액과 월세 환산금액을 바로 계산할 수 있는 무료 전월세 환산 계산기입니다. | 동일 |
| `/guides/200-million-jeonse-loan-monthly-interest` | 전세대출 2억 월이자: 금리별 부담 비교 | 동일 | 전세대출 2억 원의 월이자를 금리별로 비교하고, 2년 총이자와 월세 대안 비교 시 주의할 점을 정리했습니다. | 동일 |
| `/real-estate-brokerage-fee-calculator` | 부동산 중개수수료 계산기 | 동일 | 매매, 전세, 월세 계약 시 예상 부동산 중개보수와 부가세 포함 또는 제외 금액을 계산합니다. | 동일 |
| `/dsr-calculator` | 주담대·스트레스 DSR 계산기 - 연소득별 월 상환액 계산 | 동일 | 주택담보대출 금액, 금리, 상환기간, 연소득을 입력해 예상 DSR 비율과 스트레스 DSR 기준의 월 상환액을 계산할 수 있습니다. | 동일 |
| `/guides/100-million-jeonse-loan-interest` | 전세대출 1억 이자 계산: 월 부담은 얼마일까 | 동일 | 전세대출 1억 원을 금리별로 빌렸을 때 월 이자와 총이자가 어떻게 달라지는지 계산 전 확인할 기준을 정리했습니다. | 동일 |
| `/rent-vs-jeonse-calculator` | 월세 vs 전세 비교 계산기 | 동일 | 월세와 전세의 총 주거비를 비교해 어떤 선택이 더 유리한지 계산합니다. | 동일 |
| `/guides/monthly-rent-conversion-basics` | 전월세 전환율 쉽게 이해하기 | 동일 | 전세를 월세로, 월세를 전세로 바꿔 볼 때 전월세 전환율을 어떻게 해석해야 하는지 설명합니다. | 동일 |

## 3. 날짜 오류 수정 목록

전수 검사 결과 `basisDate`가 2026-06-10인 상황별 가이드가 기존 하드코딩 최종 수정일 2026-06-04보다 뒤에 있어 역전 가능성이 있었습니다. 아래 문서는 통합 메타데이터에서 `datePublished=2026-06-10`, `basisDate=2026-06-10`, `dateModified=2026-07-29`, `sourceCheckedAt=2026-06-10`으로 정리했습니다.

| URL | 이전 문제 | 수정 후 |
| --- | --- | --- |
| `/guides/100-million-jeonse-loan-interest` | 기준일 2026-06-10 > 최종 수정일 2026-06-04 | `dateModified=2026-07-29` |
| `/guides/200-million-jeonse-loan-monthly-interest` | 기준일 2026-06-10 > 최종 수정일 2026-06-04 | `dateModified=2026-07-29` |
| `/guides/monthly-rent-500k-to-jeonse` | 기준일 2026-06-10 > 최종 수정일 2026-06-04 | `dateModified=2026-07-29` |
| `/guides/salary-50-million-dsr` | 같은 날짜 역전 가능성 | `dateModified=2026-07-29` |
| `/guides/salary-70-million-dsr-40` | 같은 날짜 역전 가능성 | `dateModified=2026-07-29` |
| `/guides/600-million-apartment-acquisition-tax` | 같은 날짜 역전 가능성 | `dateModified=2026-07-29` |
| `/guides/900-million-apartment-acquisition-tax` | 같은 날짜 역전 가능성 | `dateModified=2026-07-29` |

## 4. legacy URL 처리 결과

| 항목 | 결과 |
| --- | --- |
| 저장소 전체 검색 | 과거 `docs/*before*`, `docs/audit/*`, 기존 보고서에는 기록으로 남아 있음. 활성 소스에서는 `next.config.ts`의 301, `src/app/sitemap.ts`의 legacy 제외 가드, `scripts/seo-audit.mjs`의 검사 문자열만 남김 |
| 운영 URL 확인 | `https://jipcalc.co.kr/severance-pay-calculator` 현재 배포본은 200 응답 |
| 대응 URL 확인 | `https://www.moneycalculator.co.kr/severance-pay-calculator` 200 응답 |
| 변경 후 로컬 production 응답 | `/severance-pay-calculator` -> 301 `https://www.moneycalculator.co.kr/severance-pay-calculator` |
| sitemap/RSS/internal link | 변경 후 after 스냅샷과 HTTP 감사 기준 legacy URL 없음 |
| canonical | 삭제된 legacy 자체 HTML/canonical 없음 |

## 5. sitemap 포함 URL 수

- HTTP SEO 감사 기준 sitemap URL: 42개
- HTML 200 검사 페이지: 42개
- query string, fragment, legacy URL, redirect URL: 0개
- after 스냅샷 전체 감지 route: 52개
- 전체 감지 route 상태: 200 응답 45개, 기존 guide alias 308 redirect 7개
- 308 redirect 7개는 sitemap 미포함: `/guides/acquisition-tax`, `/guides/brokerage-fee`, `/guides/dsr`, `/guides/jeonse-loan-interest`, `/guides/monthly-rent-conversion`, `/guides/rent-vs-jeonse`, `/guides/subscription-score`

## 6. SEO 자동 검사 결과

- `node scripts/seo-audit.mjs --source`: fatal 0, warning 0
- `npm run seo:audit`: sitemap 42개, HTML 42개, fatal 0, warning 0
- `npm run build`: production build 통과, build 후 source SEO 감사 fatal 0, warning 0

## 7. 계산 회귀 테스트 결과

- `npm test`: 11개 테스트 파일, 53개 테스트 통과
- `npm run calculation:regression`: before 17개, after 16개, retired public route 1개 제외, differences 0
- 추가 고정한 대표값:
  - 전세대출 1억 원, 연 4%, 만기일시상환 월이자 333,333원
  - 전세대출 2억 원, 연 5%, 만기일시상환 월이자 833,333원
  - 월세 50만 원, 전환율 5%, 보증금 0원 전세 환산액 120,000,000원
  - DSR = 모든 대출 연간 원리금 ÷ 연소득 × 100
  - 기존 중개수수료 테스트: 매매 5억 원, 0.4% 중개보수 2,000,000원, VAT 포함 2,200,000원

모바일 레이아웃 검사(`npm run mobile:check`)는 360px, 390px, 412px 총 27개 조합에서 실패 0건입니다.

## 8. 배포 후 네이버 수집 요청 대상 URL 목록

- `https://jipcalc.co.kr/severance-pay-calculator`
- `https://jipcalc.co.kr/sitemap.xml`
- `https://jipcalc.co.kr/rss.xml`
- `https://jipcalc.co.kr/robots.txt`
- `https://jipcalc.co.kr/`
- `https://jipcalc.co.kr/calculators`
- `https://jipcalc.co.kr/jeonse-loan-interest-calculator`
- `https://jipcalc.co.kr/monthly-rent-conversion-calculator`
- `https://jipcalc.co.kr/real-estate-brokerage-fee-calculator`
- `https://jipcalc.co.kr/dsr-calculator`
- `https://jipcalc.co.kr/rent-vs-jeonse-calculator`
- `https://jipcalc.co.kr/acquisition-tax-calculator`
- `https://jipcalc.co.kr/housing-subscription-score-calculator`
- `https://jipcalc.co.kr/guides/100-million-jeonse-loan-interest`
- `https://jipcalc.co.kr/guides/200-million-jeonse-loan-monthly-interest`
- `https://jipcalc.co.kr/guides/monthly-rent-500k-to-jeonse`
- `https://jipcalc.co.kr/guides/salary-50-million-dsr`
- `https://jipcalc.co.kr/guides/salary-70-million-dsr-40`
- `https://jipcalc.co.kr/guides/600-million-apartment-acquisition-tax`
- `https://jipcalc.co.kr/guides/900-million-apartment-acquisition-tax`
- `https://jipcalc.co.kr/guides/monthly-rent-conversion-basics`
