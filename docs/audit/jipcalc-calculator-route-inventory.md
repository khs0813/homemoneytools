# 집계산 계산기 Route Inventory

- Audit date: 2026-07-28
- Production baseline commit: `5f88bf8cbe5332ef5550a9fde7bf382e81721759`
- Remote check: `origin/main` points to the same commit.
- Runtime surface: Next.js App Router. There are no backend Controller classes; route files render React calculator components.
- Protected surfaces not changed in this audit: URL, canonical, robots, sitemap, title, H1, Naver verification tag, AdFit unit IDs and placement.

## Public Calculator Routes

| Route | Calculator slug | Main `/calculators` list | Header/footer housing menu | Sitemap | Route file | UI calculator JavaScript | Calculation service | DTO/form object | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/jeonse-loan-interest-calculator` | `jeonse-loan-interest` | yes | yes | yes | `src/app/jeonse-loan-interest-calculator/page.tsx` | `src/components/calculators/JeonseLoanCalculator.tsx` | `src/lib/calculators/loan.ts` | `LoanCalculationInput`, component Zod schema | KEEP |
| `/rent-vs-jeonse-calculator` | `rent-vs-jeonse` | yes | yes | yes | `src/app/rent-vs-jeonse-calculator/page.tsx` | `src/components/calculators/RentVsJeonseCalculator.tsx` | `src/lib/calculators/rent-vs-jeonse.ts` | `RentVsJeonseInput`, component Zod schema | KEEP |
| `/dsr-calculator` | `dsr` | yes | yes | yes | `src/app/dsr-calculator/page.tsx` | `src/components/calculators/DsrCalculator.tsx` | `src/lib/calculators/dsr.ts`, `src/lib/calculators/loan.ts` | `DsrInput`, component Zod schema | KEEP |
| `/acquisition-tax-calculator` | `acquisition-tax` | yes | yes | yes | `src/app/acquisition-tax-calculator/page.tsx` | `src/components/calculators/AcquisitionTaxCalculator.tsx` | `src/lib/calculators/acquisition-tax.ts` | `AcquisitionTaxInput`, component Zod schema | KEEP |
| `/real-estate-brokerage-fee-calculator` | `brokerage-fee` | yes | yes | yes | `src/app/real-estate-brokerage-fee-calculator/page.tsx` | `src/components/calculators/BrokerageFeeCalculator.tsx` | `src/lib/calculators/brokerage-fee.ts` | `BrokerageFeeInput`, component Zod schema | KEEP |
| `/monthly-rent-conversion-calculator` | `monthly-rent-conversion` | yes | yes | yes | `src/app/monthly-rent-conversion-calculator/page.tsx` | `src/components/calculators/RentConversionCalculator.tsx` | `src/lib/calculators/rent-conversion.ts` | `RentConversionInput`, component Zod schema | KEEP |
| `/housing-subscription-score-calculator` | `housing-subscription-score` | yes | yes | yes | `src/app/housing-subscription-score-calculator/page.tsx` | `src/components/calculators/SubscriptionScoreCalculator.tsx` | `src/lib/calculators/subscription-score.ts` | `SubscriptionScoreInput`, component Zod schema | KEEP |
| `/electricity-bill-calculator` | `electricity-bill` | no | no | yes | `src/app/electricity-bill-calculator/page.tsx` | `src/components/calculators/ElectricityBillCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | KEEP |
| `/air-conditioner-electricity-cost-calculator` | `air-conditioner-electricity-cost` | no | no | yes | `src/app/air-conditioner-electricity-cost-calculator/page.tsx` | `src/components/calculators/AirConditionerElectricityCostCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | KEEP |
| `/monthly-living-expense-calculator` | `monthly-living-expense` | no | no | yes | `src/app/monthly-living-expense-calculator/page.tsx` | `src/components/calculators/MonthlyLivingExpenseCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | KEEP |
| `/take-home-pay-calculator` | `take-home-pay` | no | no | yes | `src/app/take-home-pay-calculator/page.tsx` | `src/components/calculators/TakeHomePayCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | MIGRATE |
| `/car-maintenance-cost-calculator` | `car-maintenance-cost` | no | no | yes | `src/app/car-maintenance-cost-calculator/page.tsx` | `src/components/calculators/CarMaintenanceCostCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | KEEP |
| `/loan-interest-calculator` | `loan-interest` | no | no | yes | `src/app/loan-interest-calculator/page.tsx` | `src/components/calculators/LoanInterestCalculator.tsx` | `src/lib/calculators/finance.ts`, `src/lib/calculators/loan.ts` | inline component Zod schema | KEEP |
| `/dividend-income-calculator` | `dividend-income` | no | no | yes | `src/app/dividend-income-calculator/page.tsx` | `src/components/calculators/DividendIncomeCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | MIGRATE |
| `/exchange-rate-calculator` | `exchange-rate` | no | no | yes | `src/app/exchange-rate-calculator/page.tsx` | `src/components/calculators/ExchangeRateCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | MIGRATE |
| `/overseas-stock-capital-gains-tax-calculator` | `overseas-stock-tax` | no | no | yes | `src/app/overseas-stock-capital-gains-tax-calculator/page.tsx` | `src/components/calculators/OverseasStockTaxCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | MIGRATE |
| `/severance-pay-calculator` | `severance-pay` | no | no | yes | `src/app/severance-pay-calculator/page.tsx` | `src/components/calculators/SeverancePayCalculator.tsx` | `src/lib/calculators/finance.ts` | inline component Zod schema | RETIRE_CANDIDATE |

## Other Public Routes

| Route | Source | Sitemap | Notes |
| --- | --- | --- | --- |
| `/` | `src/app/page.tsx` | yes | Home page links only the 7 housing calculators. |
| `/calculators` | `src/app/calculators/page.tsx` | yes | Filters with `housingCalculatorSlugs`; shows 7 calculators. |
| `/guides` | `src/app/guides/page.tsx` | yes | Guide index. |
| `/guides/[slug]` plus static guide pages | `src/app/guides/**/page.tsx`, `src/config/guides.ts` | yes for configured guide paths | Dynamic route is public. |
| `/about`, `/contact`, `/disclaimer`, `/privacy-policy`, `/terms` | `src/app/*/page.tsx` | yes | Static legal/content pages. |
| `/robots.txt`, `/sitemap.xml`, `/rss.xml` | route handlers | generated | SEO-protected. |

## Shared Templates And Infrastructure

| Surface | File |
| --- | --- |
| Calculator page template | `src/components/calculator/CalculatorPage.tsx` |
| Result template | `src/components/calculator/ResultCard.tsx`, `src/components/calculator/ResultRow.tsx` |
| Input components | `src/components/calculator/MoneyInput.tsx`, `NumberInput.tsx`, `PercentInput.tsx` |
| Query DTO boundary | `src/lib/query-state.ts` |
| Money and rate formatting | `src/lib/format.ts` |
| Metadata/canonical builder | `src/lib/seo.ts` |
| Sitemap generator | `src/app/sitemap.ts` |
| Robots generator | `src/app/robots.ts` |
| Naver verification | `src/app/layout.tsx`, `src/config/site.ts` |
| AdFit | `src/components/adfit/AdFitBanner.tsx`, `src/components/adfit/AdFitPageAds.tsx` |

## Access And Analytics Notes

- Search-indexable but not menu-listed calculator routes: all public calculator routes with `Main /calculators list = no`.
- Internal-link-only calculator routes: related calculator links expose several non-menu calculators through detail pages.
- Analytics/search-console data is not available in the repository or current tool context, so traffic-based KEEP/MIGRATE/RETIRE decisions are provisional.
