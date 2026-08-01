# Growth Experiment Log

Baseline commit: `ef1324e93c9fa6de54bd059e159d6b509b1af849`

| Date | Version | Change | Primary metric | Guardrail | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-08-01 | `growth-2026-08-a` | Start Growth PR audit and implementation. | Naver CTR, calculator completion, next-action clicks, revenue/session | Calculation regression, mobile overflow, duplicate AdFit calls | In progress | Commit A production state is the baseline. |
| 2026-08-01 | `growth-2026-08-a` | Pre-deployment validation completed locally. | Same as above | Same as above | Ready for review | Production deployment not performed in this local run. |

## Experiment Version

Use `growth-2026-08-a` as the initial `experiment_version` analytics property.

## Rollback Plan

- Keep feature work in separate commits so a single calculator enhancement, AdFit slot layer, or new calculator can be reverted independently.
- AdFit placements must be disabled independently through feature flags:
  - `NEXT_PUBLIC_ENABLE_CALCULATOR_RESULT_AD`
  - `NEXT_PUBLIC_ENABLE_CALCULATOR_MID_AD`
  - `NEXT_PUBLIC_ENABLE_CALCULATOR_END_AD`
  - `NEXT_PUBLIC_ENABLE_DESKTOP_RAIL_AD`
  - `NEXT_PUBLIC_ENABLE_GUIDE_AFTER_ANSWER_AD`
- If a slot correlates with a calculator completion drop of at least 10%, disable only that slot first.
