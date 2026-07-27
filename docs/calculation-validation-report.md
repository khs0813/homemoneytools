# Calculation Validation Report

- Generated at: 2026-07-27
- Regression fixture count: 17 calculators
- Before/after calculation differences: 0
- Unit conversion and edge-case tests: `npm test` passed, 47 tests across 11 files

## Regression Result

`docs/calculation-results-before.json` and `docs/calculation-results-after.json` were compared by `npm run calculation:regression`.

Result: all fixed calculator outputs matched before and after.

## Covered Calculators

take-home-pay, loan-interest, severance-pay, dividend-income, exchange-rate, overseas-stock-tax, electricity-bill, air-conditioner-electricity-cost, car-maintenance-cost, monthly-living-expense, jeonse-loan-interest, rent-vs-jeonse, dsr, acquisition-tax, brokerage-fee, monthly-rent-conversion, housing-subscription-score

## Test Coverage Used

| Area | Test file |
| --- | --- |
| Money formatting and won display | `src/tests/format.test.ts` |
| Loan and jeonse loan interest | `src/tests/loan.test.ts` |
| DSR | `src/tests/dsr.test.ts` |
| Acquisition tax | `src/tests/acquisition-tax.test.ts` |
| Brokerage fee | `src/tests/brokerage-fee.test.ts` |
| Rent vs jeonse | `src/tests/rent-vs-jeonse.test.ts` |
| Rent conversion | `src/tests/rent-conversion.test.ts` |
| Subscription score | `src/tests/subscription-score.test.ts` |
| Other finance calculators | `src/tests/finance.test.ts` |
| SEO and sitemap/RSS metadata | `src/tests/seo.test.ts` |
| Input safety helpers | `src/tests/security.test.ts` |

## UI Result Display Changes

The calculator formulas were not changed for this SEO pass. Result cards were expanded to show required already-computable fields:

- DSR: general DSR, stress DSR, target criterion, margin ratio, annual/monthly repayment, existing loan amount, formula.
- Acquisition tax: acquisition tax, local education tax, special rural tax, discount difference, total tax, effective rate.
- Brokerage fee: transaction amount, legal rate, legal upper amount, negotiated rate, negotiated fee, VAT, total, monthly-rent converted transaction amount.
- Rent vs jeonse: loan interest, opportunity costs, optional guarantee/brokerage/moving costs, all-in total housing cost, monthly equivalent, break-even rent.
- Rent conversion: existing deposit, changed deposit, deposit difference, conversion rate, expected monthly rent, jeonse equivalent.
- Subscription score: component scores, total score, next score increase timing, input caution.
- Jeonse loan: monthly interest, total interest, guarantee fee, total finance cost, 0.5%p/1.0%p rate-rise scenarios, loan-to-deposit ratio.
- Electricity bill: progressive tier, tier usage, base fee, energy charge, add-ons, total, +/-50kWh differences.
- Dividend income: gross/net annual dividend, per-payment amount, monthly equivalent, after-tax yield, principal needed for target monthly dividend.

## Changed Calculation Outputs

None. No before/after calculator fixture output changed.
