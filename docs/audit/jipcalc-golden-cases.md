# 집계산 계산기 Golden Cases

- Audit date: 2026-07-28
- Production baseline commit: `5f88bf8cbe5332ef5550a9fde7bf382e81721759`

## Reproduced P0-V

| Area | Reproduction | Result | Action |
| --- | --- | --- | --- |
| DSR stress rate display | Playwright on `/dsr-calculator`: 3억원, 4%, 30년, 연소득 7천만원, 스트레스 3%p | Actual monthly repayment label was missing; the visible monthly repayment was the stress assessment amount. | Added actual-rate and assessment-rate rows separately. |

## P0-V Not Reproduced

| Area | Case | Result | Evidence |
| --- | --- | --- | --- |
| Acquisition tax heavy local education tax | `/acquisition-tax-calculator`, 5억원, 4주택 이상, 85㎡ 이하 | Local education tax is 2,000,000원, not 12% acquisition tax * 10%. | `scripts/p0v-audit.spec.mjs` passed after selector correction. |
| DSR calculation engine | Same DSR inputs with stress 3%p | Service keeps `totalAnnualRepayment` and `monthlyAverageRepayment` at contract-rate values while `assessment*` uses stress rate. | `src/tests/dsr.test.ts` regression. |

## Golden Cases Added Or Reconfirmed

| Calculator | Input | Expected |
| --- | --- | --- |
| 취득세 | 599,999,999원, 1주택 | rate 1% |
| 취득세 | 600,000,000원, 1주택 | rate 1% |
| 취득세 | 600,000,001원, 1주택 | rounded rate 1% |
| 취득세 | 650,000,000원, 1주택 | rate 1.3333%, acquisition tax 8,666,450원, local education tax 866,645원 |
| 취득세 | 750,000,000원, 1주택 | rate 2% |
| 취득세 | 899,999,999원, 1주택 | rounded rate 3% |
| 취득세 | 900,000,000원, 1주택 | rate 3% |
| 취득세 | 900,000,001원, 1주택 | rate 3% |
| DSR | 3억원, 4%, 30년, 연소득 7천만원, stress 0%p | actual monthly average 1,432,246원 |
| DSR | same, stress 3%p | actual monthly average remains 1,432,246원; assessment monthly average 1,995,907원 |

## Existing Covered Cases

The existing Vitest suite already covers:

- loan interest-only, equal-payment, equal-principal, zero-rate equal-payment
- jeonse loan guarantee fee and over-deposit validation
- brokerage legal-rate cap, VAT toggle, monthly-rent transaction amount
- rent conversion jeonse-to-rent, rent-to-jeonse, legal maximum warning, invalid replacement deposit
- rent-vs-jeonse total cost, loan amount cap
- subscription score date validation, spouse account score, total account score cap
- finance calculators for take-home pay, loan interest, dividend, air conditioner
- SEO metadata, sitemap lastmod, RSS pubDate, site config
