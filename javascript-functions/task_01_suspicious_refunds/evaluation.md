# Evaluation: Task 01 Suspicious Refund Detection

## Task Summary

The task asks for a JavaScript function that identifies suspicious refund behavior from transaction records. A user should be flagged when their refund count meets or exceeds a threshold, their refund amount ratio meets or exceeds a threshold, or they have at least 2 refunds within a configurable rolling time window. The output should include user-level summary metrics, reason codes, and stable sorting by `userId`.

## Submitted Solution Reviewed

`flawed_solution.js` was reviewed. The solution groups transactions by user and returns summary objects with refund counts, totals, ratios, and reasons. The implementation is plausible, but it omits one major detection rule and applies other rules incorrectly.

## Verdict

Partially correct, but not acceptable for benchmark use. The submitted solution handles basic grouping and counting, yet misses refund-ratio-only suspicious users, treats threshold equality incorrectly, and calculates refund velocity globally instead of per user. These issues create both false negatives and false positives.

## Rubric Score Table

| Category | Score | Notes |
| --- | ---: | --- |
| Correctness | 2/5 | Implements basic aggregation, but fails multiple required suspicious-user rules. |
| Efficiency | 4/5 | Uses simple linear grouping and is efficient enough for the task size. |
| Code Quality | 3/5 | The code is readable, but object-based grouping, missing sorting, and hidden global velocity logic reduce reliability. |
| Edge Cases | 2/5 | Fails threshold equality, refund-ratio-only users, and per-user velocity scenarios. |
| Explanation / Communication | 2/5 | The implementation does not make its assumptions clear or explain why ratio detection is absent. |
| Total | 13/25 | Structurally plausible but materially incorrect on core business rules. |

## Bugs Found

- BUG-001, Major issue: Refund-count threshold equality is handled incorrectly because the solution uses `>` instead of `>=`.
- BUG-002, Major issue: Refund ratio is calculated for the output but ignored as a suspicious-user reason, so ratio-only users are missed.
- BUG-003, Major issue: Refund velocity is calculated globally across all users instead of independently per user, causing false positives when different users each have one refund close together.
- BUG-004, Minor issue: The output is not explicitly sorted by `userId`, so result ordering depends on object insertion order rather than the required stable sort.

## Bug-to-Test Mapping Table

| Bug ID | Bug Description | Test Name | Input / Scenario | Expected Behavior | Actual Flawed Behavior |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Uses `>` instead of `>=` for refund-count threshold. | `flawed misses threshold equality case` | One user has exactly 3 refunds and the default threshold is 3. | User should be flagged with `REFUND_COUNT`. | User is not flagged. |
| BUG-002 | Ignores refund-ratio suspicious rule. | `flawed misses refund-ratio-only suspicious user` | One user has $70 refunds against $100 purchases. | User should be flagged with `REFUND_RATIO`. | User is not flagged. |
| BUG-003 | Checks refund velocity globally instead of per user. | `flawed misclassifies refund velocity globally instead of per user` | Two different users each have one refund within the same 24-hour period. | Neither user should be flagged for velocity. | Both users are flagged with `REFUND_VELOCITY`. |
| BUG-004 | Does not explicitly sort output by `userId`. | `correct returns stable userId-sorted output` | Suspicious users appear in unsorted transaction order. | Output should be sorted by `userId` ascending. | Flawed output ordering is not guaranteed by the required sort rule. |

## Edge Cases Considered

- Empty input should return `[]`.
- Users with exactly the threshold number of refunds should be suspicious.
- Users whose refund ratio exactly equals the threshold should be suspicious.
- Users with refunds but no purchases should not cause a divide-by-zero crash.
- Refund velocity should be checked per user.
- Refund timestamps may arrive unsorted and should be normalized before rolling-window checks.
- Output should be sorted by `userId` for stable evaluator comparisons.

## Feedback to the AI Model

The grouping structure is a reasonable start, but the detection logic does not fully implement the prompt. In evaluation tasks, each business rule should be translated into a direct condition and tested with a minimal case. Pay close attention to equality language such as "greater than or equal to" and to whether a rule applies globally or per entity.

## Suggested Fixes

- Change refund-count detection from `>` to `>=`.
- Add `REFUND_RATIO` when `totalRefundAmount / totalPurchaseAmount` is greater than or equal to the configured threshold.
- Calculate refund velocity from each user's own refund timestamps.
- Sort each user's refund timestamps before comparing rolling-window differences.
- Sort the final suspicious-user summaries by `userId` ascending.
- Decide and document behavior for refunds with no purchase amount, then test that behavior.

## Final Notes

This flawed solution is useful for evaluator training because it looks organized and returns plausible summaries, but it fails important rule interpretation details that a strong AI code evaluator should catch.
