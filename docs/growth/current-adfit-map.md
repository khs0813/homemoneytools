# Current AdFit Map

Audit date: 2026-08-01
Production baseline commit: `ef1324e93c9fa6de54bd059e159d6b509b1af849`

## Source Files

- `src/components/adfit/AdFitBanner.tsx`
- `src/components/adfit/AdFitPageAds.tsx`
- Imports in `src/components/calculator/CalculatorPage.tsx`
- Imports in `src/components/content/GuidePage.tsx`
- Imports in `src/app/page.tsx`
- Imports in `src/app/calculators/page.tsx`
- Imports in `src/app/guides/page.tsx`
- Imports in `src/components/legal/LegalPage.tsx`

## Existing Unit Keys

| Key | Size | Current wrapper | Notes |
| --- | --- | --- | --- |
| `DAN-MxttnTNbygaLu9ii` | `320x50` | `AdFitTopBanner`, `AdFitMobileCalculatorHeaderAds` | Mobile banner. |
| `DAN-vydppL950Rcp0u3T` | `728x90` | `AdFitTopBanner`, `AdFitDesktopTopBanner` | Desktop horizontal banner. |
| `DAN-3zihtfJ5ImCC9NOc` | `160x600` | `AdFitVerticalBanner` | Wide desktop side unit. |
| `DAN-tzq6el4IGCSFEnSl` | `320x480` | `AdFitMobileRectangleBanner` | Mobile large rectangle. |
| `DAN-4cOowgAme3T2tNK2` | `300x250` | `AdFitMobileCalculatorHeaderAds`, `AdFitMobileMediumRectangleBanner` | Mobile medium rectangle. |

## Current Placement Risks

- Calculator pages currently render mobile AdFit above the calculator hero through `AdFitMobileCalculatorHeaderAds`.
- Calculator pages currently render desktop top AdFit immediately after the calculator workspace through `AdFitDesktopTopBanner`.
- Side ads may appear through `AdFitSideBanner`.
- Units are not named by placement, which makes page/slot revenue comparison difficult.
- Unit keys are hardcoded rather than Render environment driven.

## Growth Direction

- Preserve the existing keys as fallback values for compatibility.
- Add placement names:
  - `calculator_result_primary`
  - `calculator_mid_content`
  - `calculator_end`
  - `guide_after_answer`
  - `guide_mid_content`
  - `guide_end`
  - `desktop_side_rail`
- Gate each slot with a public feature flag.
- Insert calculator ads after a result summary or meaningful content, not before the input form.
- Insert only the matching device ad unit into the DOM.
- Track `ad_slot_rendered` and `ad_slot_viewable`; do not track ad clicks.

