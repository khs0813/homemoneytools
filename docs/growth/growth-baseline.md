# Growth Baseline

Audit date: 2026-08-01
Production baseline commit: `ef1324e93c9fa6de54bd059e159d6b509b1af849`

## Operator-Provided Search Baseline

- Recent Naver impressions: about `3,400`.
- Recent Naver clicks: about `42`.
- Average CTR: about `1.2%`.

## 28-Day Targets

- Naver CTR: `1.2%` to `1.8-2.0%`.
- Calculator completion rate: at least `10%` above current baseline.
- Related calculator click rate: at least `8%`.
- Pages per session: at least `30%` above current baseline.
- Ad revenue per session: at least `30%` above current baseline.
- Mobile horizontal scroll, calculation regressions, duplicated ad calls: `0`.

## Protected High-Performance Pages

Metadata should not be changed unless a specific defect is found:

- `/guides/100-million-jeonse-loan-interest`
- `/guides/salary-50-million-dsr`
- `/guides/600-million-apartment-acquisition-tax`
- `/rent-vs-jeonse-calculator`

## Current Target Metadata Before Growth Edits

| URL | Title source | Current title | Current description |
| --- | --- | --- | --- |
| `/` | page metadata | `전세·월세·매매 주거비 계산기 \| 집계산` | `전세대출 이자, 월세 vs 전세, DSR, 취득세, 중개수수료, 전월세 전환, 청약가점을 계산하고 해석까지 돕는 주거비 정보 서비스입니다.` |
| `/jeonse-loan-interest-calculator` | calculator `seoTitle` | `전세대출 이자 계산기 - 월 이자·총이자 계산 \| 집계산` | `전세보증금, 대출금액, 금리, 기간을 입력해 전세대출 월 이자와 총이자를 계산합니다. 1억·2억 전세대출 이자와 금리 상승 시나리오도 함께 확인하세요.` |
| `/monthly-rent-conversion-calculator` | calculator `seoTitle` | `월세 전세 환산 계산기 - 보증금·월세 전환금액 계산 \| 집계산` | `보증금과 월세를 입력하면 전세 환산금액과 월세 환산금액을 바로 계산할 수 있는 무료 전월세 환산 계산기입니다.` |
| `/dsr-calculator` | calculator `seoTitle` | `주담대·스트레스 DSR 계산기 - 연소득별 월 상환액 계산 \| 집계산` | `주택담보대출 금액, 금리, 상환기간, 연소득을 입력해 예상 DSR 비율과 스트레스 DSR 기준의 월 상환액을 계산할 수 있습니다.` |
| `/real-estate-brokerage-fee-calculator` | calculator title | `부동산 중개수수료 계산기 \| 집계산` | `매매, 전세, 월세 계약 시 예상 부동산 중개보수와 부가세 포함 또는 제외 금액을 계산합니다.` |
| `/acquisition-tax-calculator` | calculator `seoTitle` | `취득세 계산기 - 주택 수·조정대상지역 반영 \| 집계산` | `주택 가격, 주택 수, 조정대상지역, 생애최초 감면 여부를 반영해 취득세와 지방교육세 등 부가 세목을 추정합니다. 6억·9억 아파트 취득세를 빠르게 확인하세요.` |

## Measurement Model

Required funnel events:

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

Privacy constraints:

- Do not send raw loan amount, salary, housing price, deposit, monthly rent, user-entered terms, or calculation result values to analytics.
- Do not create ad click tracking.
- Use AdFit reports for ad revenue and compare by date, page, and ad unit/placement against analytics page and viewability events.

