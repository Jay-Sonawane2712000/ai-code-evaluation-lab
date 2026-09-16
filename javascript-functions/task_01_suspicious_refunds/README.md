# Task 01: Suspicious Refund Detection

## Objective

Write a JavaScript function that identifies users with suspicious refund behavior from a list of transaction records. The function should support configurable thresholds and return stable, testable user summaries.

## Input Schema

Each transaction object has the following shape:

```js
{
  transactionId: "txn_001",
  userId: "user_001",
  type: "purchase", // "purchase" or "refund"
  amount: 49.99,
  timestamp: "2026-06-01T10:00:00Z"
}
```

## Business Rules

A user is suspicious if any of these conditions are true:

- Refund count is greater than or equal to the configured refund-count threshold.
- Refund amount ratio is greater than or equal to the configured refund-ratio threshold.
- The user has at least 2 refunds within the configured rolling time window.

Refund amount ratio is:

```text
total refunded amount / total purchased amount
```

Refund velocity must be calculated per user, not across all users.

## Default Thresholds

```js
{
  refundCountThreshold: 3,
  refundRatioThreshold: 0.5,
  rollingWindowHours: 24
}
```

## Required Output Format

Return an array of suspicious user summaries sorted by `userId` ascending.

Each summary should include:

```js
{
  userId: "user_001",
  refundCount: 3,
  totalRefundAmount: 120,
  totalPurchaseAmount: 200,
  refundRatio: 0.6,
  reasons: ["REFUND_COUNT", "REFUND_RATIO"]
}
```

Valid reason codes are:

- `REFUND_COUNT`
- `REFUND_RATIO`
- `REFUND_VELOCITY`

## Edge Cases to Consider

- Empty transaction input should return an empty array.
- Threshold equality should count as suspicious.
- Users with refunds but no purchases should not cause a divide-by-zero crash.
- Refund velocity should be checked using each user's refund timestamps.
- Refund timestamps may not arrive sorted.
- Output should be stable and sorted by `userId`.
- Unknown transaction types should not affect purchase or refund totals.

## Expected Deliverables

- A correct CommonJS implementation exporting `findSuspiciousRefundUsers`.
- A plausible flawed implementation for evaluator testing.
- Jest tests that verify the correct solution and expose seeded flaws.
- A written evaluation using the shared 25-point rubric.
