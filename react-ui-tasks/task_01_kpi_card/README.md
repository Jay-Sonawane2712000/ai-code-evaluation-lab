# Task 01: KPI Card Component

## Objective

Build a reusable React KPI card component that displays a metric label, value, optional comparison change, and clear loading or error states. The component should be small, accessible, and easy to test with React Testing Library.

## Props API

```jsx
<KpiCard
  label="Revenue"
  value={12345.67}
  change={8.2}
  format="currency"
  loading={false}
  error={null}
/>
```

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `string` | Metric label displayed on the card. |
| `value` | `number \| string \| null` | Main KPI value. |
| `change` | `number \| null` | Optional comparison/change value. |
| `format` | `"number" \| "currency" \| "percent"` | Formatting mode for the main value. |
| `loading` | `boolean` | Whether the card should show a loading state. |
| `error` | `string \| null` | Optional error message. |

## UI and Business Rules

1. If `loading` is true, show a loading state and do not show value or error.
2. If `error` exists and `loading` is false, show an accessible error state.
3. If `value` is null or undefined, show `No data`.
4. Currency values should be formatted as USD, for example `$12,345.67`.
5. Percent values should be formatted with a percent sign.
6. Positive change should show a positive state.
7. Negative change should show a negative state.
8. Zero or missing change should show a neutral state or omit change text.
9. The component should be accessible with useful aria labels or roles.
10. The component should be small, reusable, and testable.

## Accessibility Expectations

- The card should expose an accessible region or label tied to the KPI label.
- Loading state should be understandable to assistive technology.
- Error state should use an appropriate role such as `alert`.
- Change text should communicate whether the change is positive, negative, or neutral.

## Required Output Format

Create a React component in `KpiCard.jsx` and export it as the default export.

The rendered card should include:

- KPI label
- Formatted value or `No data`
- Optional change text with a clear state
- Loading and error states with correct precedence

## Edge Cases to Consider

- `loading` and `error` are both present.
- `value` is `null` or `undefined`.
- `value` is already a string.
- `change` is positive, negative, zero, or missing.
- Currency and percent formatting should be predictable in tests.
- The card should remain accessible without relying on visual styling.

## Expected Deliverables

- A correct React component and tests.
- A plausible flawed React component and tests that demonstrate its incorrect behavior.
- Task-local Jest, Babel, React, Testing Library, and jest-dom configuration.
- A written evaluation using the shared 25-point rubric.
