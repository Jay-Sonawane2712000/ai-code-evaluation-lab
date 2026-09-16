# Evaluation: Task 01 KPI Card

## Task Summary

The task asks for a reusable React KPI card component that displays a label, value, optional change value, loading state, error state, and optional formatting mode. The component must prioritize loading over error, handle missing values as `No data`, format currency and percent values, represent positive and negative changes clearly, and expose useful accessibility semantics.

## Submitted Solution Reviewed

`flawed/KpiCard.jsx` was reviewed. The component renders a KPI label, value, loading text, error message, and optional change text. The implementation is compact and plausible, but it violates several required UI and accessibility rules.

## Verdict

Partially correct, but not acceptable as a reusable KPI component. The component renders simple happy-path values, but it mishandles loading/error precedence, missing values, negative changes, and accessibility. These defects would create misleading dashboard output and make the component harder to verify with assistive technology or automated UI tests.

## Rubric Score Table

| Category | Score | Notes |
| --- | ---: | --- |
| Correctness | 2/5 | Handles basic rendering, but fails multiple required state and formatting rules. |
| Efficiency | 5/5 | The component is small and has no unnecessary expensive operations. |
| Code Quality | 3/5 | The code is readable, but `value || 0` hides important null/zero distinctions and change-state logic is incomplete. |
| Edge Cases | 2/5 | Fails loading plus error, null values, negative change display, and accessibility edge cases. |
| Explanation / Communication | 2/5 | The implementation does not communicate assumptions about empty values, change states, or accessibility semantics. |
| Total | 14/25 | Plausible structure, but several core UI requirements are implemented incorrectly. |

## Bugs Found

- BUG-001, Major issue: Error state incorrectly takes precedence over loading. The prompt requires loading to be shown first and to suppress error/value output.
- BUG-002, Major issue: Null values are converted to `0` or `$0.00` instead of rendering `No data`.
- BUG-003, Major issue: Negative changes are displayed as positive values with a non-negative state.
- BUG-004, Major issue: The card does not expose a useful accessible region or aria label, and the error state does not use an alert role.

## Bug-to-Test Mapping Table

| Bug ID | Bug Description | Test Name | Input / Scenario | Expected Behavior | Actual Flawed Behavior |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Error state takes precedence over loading. | `flawed fails loading precedence when error is also present` | `loading={true}` and `error="Failed"` are both provided. | Loading state should appear and error should be hidden. | Error message appears and loading text is missing. |
| BUG-002 | Null value is formatted as zero. | `flawed formats null currency value incorrectly` | `value={null}` and `format="currency"`. | Component should render `No data`. | Component renders `$0.00`. |
| BUG-003 | Negative change is displayed as positive. | `flawed displays negative change incorrectly` | `change={-2.3}`. | Component should render `-2.3%` with a negative state. | Component renders `+2.3%` with a neutral state. |
| BUG-004 | Missing accessibility labeling. | `flawed lacks expected accessible region or label` | Normal KPI card render. | Component should expose an accessible region such as `Revenue KPI card`. | No named region or equivalent accessible label is available. |

## Edge Cases Considered

- Loading and error props are both present.
- Error is present while loading is false.
- Value is `null` or `undefined`.
- Currency values require USD formatting.
- Percent values require a percent sign.
- Positive, negative, zero, and missing change values require distinct handling.
- The card should be discoverable by role or accessible name in React Testing Library.

## Feedback to the AI Model

The component starts with a reasonable shape, but it needs to translate the prompt's precedence and display rules more directly. Avoid using fallback expressions such as `value || 0` when `null`, `undefined`, `0`, and empty strings have different product meanings. For UI components, accessibility should be part of the rendered contract, not a styling afterthought.

## Suggested Fixes

- Check `loading` before checking `error`.
- Render `No data` when `value` is `null` or `undefined`.
- Preserve the sign of negative changes and mark them with a negative state.
- Add a named `section` or other accessible region tied to the KPI label.
- Use `role="status"` for loading and `role="alert"` for errors.
- Add tests for precedence, null values, negative changes, and accessibility semantics.

## Final Notes

This flawed component is useful for evaluator training because it appears concise and functional at first glance, but it misses important state precedence, data meaning, and accessibility requirements that a strong frontend evaluator should catch.
