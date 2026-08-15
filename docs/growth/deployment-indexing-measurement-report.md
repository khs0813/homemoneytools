# Deployment, Indexing, And Measurement Report

Generated at: 2026-08-01
Branch: `growth-search-funnel-adfit-total-cost`
Production baseline commit: `ef1324e93c9fa6de54bd059e159d6b509b1af849`
Experiment version: `growth-2026-08-a`

## Technical Structure

- Next.js App Router under `src/app`, Next.js `16.2.6`, React `19.2.6`, TypeScript `5.9.3`.
- Calculator pages are server-rendered shells with client calculator forms.
- Calculation services remain in `src/lib/calculators`; formulas were reused rather than copied.
- Metadata/canonical generation remains through `src/lib/seo.ts`.
- Sitemap generation remains `src/app/sitemap.ts`; new calculator is included through `calculators` config and has self-canonical.

## Modified And New URLs

Modified visible URLs:

- `/`
- `/jeonse-loan-interest-calculator`
- `/monthly-rent-conversion-calculator`
- `/rent-vs-jeonse-calculator`
- `/dsr-calculator`
- `/real-estate-brokerage-fee-calculator`
- `/acquisition-tax-calculator`
- guide pages rendered by `GuidePage` have AdFit placement changes after answer sections.

New URL:

- `/home-purchase-total-cost-calculator`

## Metadata Changes

| URL | Title before | Title after | Description before | Description after |
| --- | --- | --- | --- | --- |
| `/jeonse-loan-interest-calculator` | `전세대출 이자 계산기 - 월 이자·총이자 계산 \| 집계산` | `전세대출 이자 계산기 \| 1억·2억·3억 월이자 비교 \| 집계산` | `전세보증금, 대출금액, 금리, 기간을 입력해 전세대출 월 이자와 총이자를 계산합니다. 1억·2억 전세대출 이자와 금리 상승 시나리오도 함께 확인하세요.` | `대출금액·금리·기간을 입력하면 전세대출 월이자와 총이자를 계산합니다. 1억·2억·3억원의 금리별 부담과 금리 상승 시 변화를 비교하세요.` |
| `/monthly-rent-conversion-calculator` | `월세 전세 환산 계산기 - 보증금·월세 전환금액 계산 \| 집계산` | `월세 전세 환산 계산기 \| 월세 50만·100만원 전세금 \| 집계산` | `보증금과 월세를 입력하면 전세 환산금액과 월세 환산금액을 바로 계산할 수 있는 무료 전월세 환산 계산기입니다.` | `월세를 전세금으로, 전세를 월세로 환산합니다. 보증금과 전환율을 입력해 월세 50만·70만·100만원의 전세 환산액을 확인하세요.` |
| `/dsr-calculator` | `주담대·스트레스 DSR 계산기 - 연소득별 월 상환액 계산 \| 집계산` | `DSR 계산기 \| 주담대·스트레스 DSR·월상환액 \| 집계산` | `주택담보대출 금액, 금리, 상환기간, 연소득을 입력해 예상 DSR 비율과 스트레스 DSR 기준의 월 상환액을 계산할 수 있습니다.` | `연소득과 주담대·신용대출 조건을 입력해 일반 DSR과 스트레스 DSR, 월 원리금과 기준까지 남은 상환 여력을 계산합니다.` |
| `/real-estate-brokerage-fee-calculator` | `부동산 중개수수료 계산기 \| 집계산` | `부동산 중개수수료 계산기 \| 매매·전세·월세 복비 \| 집계산` | `매매, 전세, 월세 계약 시 예상 부동산 중개보수와 부가세 포함 또는 제외 금액을 계산합니다.` | `매매가·보증금·월세를 입력해 중개보수 상한액, 협의요율, 월세 환산거래금액과 부가세 포함 예상액을 계산합니다.` |
| `/home-purchase-total-cost-calculator` | none | `내 집 마련 총비용 계산기 \| 취득세·중개수수료·대출 \| 집계산` | none | `주택가격과 대출·보유 현금을 입력해 취득세, 중개수수료, 월 원리금과 계약부터 잔금까지 필요한 총 현금을 계산합니다.` |

Protected metadata retained:

- `/rent-vs-jeonse-calculator`
- `/guides/100-million-jeonse-loan-interest`
- `/guides/salary-50-million-dsr`
- `/guides/600-million-apartment-acquisition-tax`

H1, canonical, robots, HTTPS/www, trailing slash, and Naver verification policy were retained.

## User Journey Changes

- Added `QuickPresetGroup` to 전세대출, 월세 전세 환산, DSR, 중개수수료, and 내 집 마련 총비용.
- Added `ResultSummary` to target calculators with basis date and assumptions.
- Added `RecommendedNextActions` with at most three actual `a href` links per result.
- Added `RecentCalculations` on home using localStorage only.
- Added `ShareResult` using `navigator.share` when available and clipboard fallback otherwise.
- Share and handoff state uses URL fragment, not query string; fragments are not included in sitemap.

localStorage policy:

- Key: `jipcalc:recent-calculations:v1`
- Fields: `calculator_type`, `page_path`, `summary`, `saved_at`
- Max items: 5
- Retention: 30 days
- No server transmission and no analytics transmission of raw input/result values.

## Analytics Events

Implemented events:

- `organic_landing_view`
- `calculator_start`
- `calculator_complete`
- `result_view`
- `preset_selected`
- `next_action_view`
- `next_action_click`
- `related_calculator_click`
- `guide_to_calculator_click`
- `recent_calculation_open`
- `share_result_click`
- `ad_slot_rendered`
- `ad_slot_viewable`

Common dimensions:

- `page_path`
- `calculator_type`
- `content_cluster`
- `device_type`
- `referrer_type`
- `source_section`
- `target_path`
- `preset_name`
- `ad_placement`
- `experiment_version`

Naver organic referrer is classified as `referrer_type = naver_organic`.

## AdFit Placements

Implemented placements:

- `calculator_result_primary`
- `calculator_mid_content`
- `calculator_end`
- `guide_after_answer`
- `guide_mid_content`
- `guide_end`
- `desktop_side_rail`

Calculator pages now call result ads after `ResultSummary`, not above the input form or between the button and first result. Mobile and desktop units are inserted by viewport; CSS `display:none` is not used to hide the wrong device slot.

Required Render env vars:

- `NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD`
- `NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD`
- `NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD`
- `NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD`
- `NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD`
- `NEXT_PUBLIC_ADFIT_MOBILE_RESULT`
- `NEXT_PUBLIC_ADFIT_MOBILE_MID`
- `NEXT_PUBLIC_ADFIT_MOBILE_END`
- `NEXT_PUBLIC_ADFIT_DESKTOP_RESULT`
- `NEXT_PUBLIC_ADFIT_DESKTOP_MID`
- `NEXT_PUBLIC_ADFIT_DESKTOP_RAIL`
- `NEXT_PUBLIC_ADFIT_GUIDE_MOBILE_AFTER_ANSWER`
- `NEXT_PUBLIC_ADFIT_GUIDE_DESKTOP_AFTER_ANSWER`

Existing hardcoded AdFit keys are retained as fallback values where an equivalent legacy unit exists.

## Validation Results

- `npm test`: 15 files, 64 tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with `SEO audit completed: 0 fatal, 0 warning`.
- Runtime `npm run seo:audit`: 43 HTML pages, 0 fatal, 0 warning.
- `npm run seo:user-agents`: 8 paths, Browser/Yeti/Googlebot, 0 failures.
- `npm run mobile:check`: 27 viewport/path combinations, 0 failures.
- `npm run calculation:regression`: 0 differences.
- `npm run content:duplication`: 0 failures.
- `npm run performance:check`: 0 failures, local CLS 0 on checked pages.

Notes:

- Initial sandboxed `next build`, local server, localhost fetch, and Chrome DevTools runs failed due sandbox port/process restrictions. The same commands passed after approved non-sandbox execution.
- Production deployment has not been performed from this local run.

## Sitemap And Indexing

Sitemap changes:

- Added canonical URL `/home-purchase-total-cost-calculator`.
- Fragment URLs and query URLs are not included.

Naver collection request candidates after production deployment:

- `https://jipcalc.co.kr/`
- `https://jipcalc.co.kr/jeonse-loan-interest-calculator`
- `https://jipcalc.co.kr/monthly-rent-conversion-calculator`
- `https://jipcalc.co.kr/dsr-calculator`
- `https://jipcalc.co.kr/real-estate-brokerage-fee-calculator`
- `https://jipcalc.co.kr/acquisition-tax-calculator`
- `https://jipcalc.co.kr/guides/200-million-jeonse-loan-monthly-interest`
- `https://jipcalc.co.kr/home-purchase-total-cost-calculator`

Request each URL only after confirming HTTP 200, extractable title/description, self-canonical, and robots index/follow in production.

## Rollback

Feature flags can disable individual ad slots without reverting code. If a behavioral regression appears, revert the smallest feature commit:

- `feat: optimize adfit slots and device-specific loading`
- `feat: add home purchase total cost calculator`
- `feat: add next actions recent calculations and sharing`
- `feat: add calculator presets and result summaries`

Do not roll back protected SEO baseline unless the changed feature itself is the cause.

## Measurement Windows

For 14 and 28 days after deployment, do not change core SEO metadata again unless a critical bug appears. Compare:

- URL/query-level Naver impressions, clicks, CTR.
- `organic_landing_view`, `calculator_start`, `calculator_complete`, `result_view`, `next_action_click`.
- Pages/session, return visits, share usage.
- AdFit placement impressions, viewability, eCPM, revenue, revenue/session, revenue per 1,000 sessions.

