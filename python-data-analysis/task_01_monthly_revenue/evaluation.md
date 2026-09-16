# Evaluation: Task 01 Monthly Revenue

## Task Summary

The task asks for a pandas-based ecommerce analysis that calculates monthly net revenue, monthly refund rate, and top product categories by net revenue. The required business rules state that completed orders add revenue, refunded orders subtract revenue, months must be grouped in `YYYY-MM` calendar-month format, refund rate must use total monthly order count as the denominator, and monetary values should be rounded to 2 decimals.

## Submitted Solution Reviewed

`flawed_solution.py` was reviewed. The solution loads the CSV, creates revenue values, groups data with pandas, and returns DataFrames for the requested outputs. The implementation is plausible and readable, but it misapplies several core business rules.

## Verdict

Partially correct, but not acceptable for production or benchmark use. The solution has major correctness errors in monthly revenue and refund-rate logic. It produces output DataFrames, but the numbers are materially wrong for common scenarios involving refunds and multiple orders in the same month.

## Rubric Score Table

| Category | Score | Notes |
| --- | ---: | --- |
| Correctness | 2/5 | Produces outputs, but three core business rules are implemented incorrectly. |
| Efficiency | 4/5 | Uses vectorized pandas grouping and aggregation, which is appropriate for this task. |
| Code Quality | 3/5 | Code is readable and organized, but misleading column names hide denominator and grouping mistakes. |
| Edge Cases | 2/5 | Fails refund handling, same-month multi-day grouping, and correct refund-rate denominator cases. |
| Explanation / Communication | 2/5 | The implementation does not document assumptions or clarify the business-rule choices that went wrong. |
| Total | 13/25 | The solution is structurally plausible but fails important evaluation criteria. |

## Bugs Found

- BUG-001, Major issue: Refunded orders are counted as positive revenue instead of being subtracted from net revenue. This inflates monthly and category revenue whenever refunds exist.
- BUG-002, Major issue: Monthly revenue is grouped by raw `order_date` instead of calendar month in `YYYY-MM` format. This creates one row per date rather than one row per month.
- BUG-003, Major issue: Refund rate uses completed orders as the denominator instead of total orders for the month. This overstates refund rates and reports a misleading `total_orders` value.

## Bug-to-Test Mapping Table

| Bug ID | Bug Description | Test Name | Input / Scenario | Expected Behavior | Actual Flawed Behavior |
| --- | --- | --- | --- | --- | --- |
| BUG-001 | Refunded orders are counted as positive revenue. | `test_flawed_monthly_revenue_counts_refunds_positive` | January has one completed $100 order and one refunded $40 order. | January net revenue should be $60.00. | January revenue totals $140.00 because the refund is added. |
| BUG-002 | Monthly revenue is grouped by raw order date. | `test_flawed_groups_by_raw_order_date` | January contains orders on `2026-01-15` and `2026-01-31`. | Output should contain one `2026-01` row. | Output contains separate rows for `2026-01-15` and `2026-01-31`. |
| BUG-003 | Refund rate denominator uses completed orders instead of total orders. | `test_flawed_refund_rate_uses_wrong_denominator` | February has 3 total orders: 2 completed and 1 refunded. | Refund rate should be `1 / 3 = 0.3333`. | Refund rate is `1 / 2 = 0.5`, and completed orders are mislabeled as total orders. |

## Edge Cases Considered

- Refunded rows with nonzero quantity and price should reduce revenue.
- Multiple orders in the same calendar month but on different days should be grouped together.
- Month-boundary dates such as `2026-01-31` and `2026-02-01` should stay in their respective calendar months.
- Zero-quantity orders should contribute zero revenue while still counting as orders.
- Refund-rate calculations should count completed and refunded orders in the denominator.

## Feedback to the AI Model

The solution structure is a reasonable start, but the implementation needs closer alignment with the business rules. In data-analysis tasks, small denominator and grouping choices can materially change the answer. Before finalizing, derive the expected result for a tiny hand-checkable dataset and compare the code output against that result.

## Suggested Fixes

- Create a signed revenue column where refunded orders multiply row revenue by `-1`.
- Convert `order_date` to a calendar month column using `dt.to_period("M").astype(str)` before grouping.
- Calculate refund rate as `refunded_orders / total_orders`, where `total_orders` counts every order in that month.
- Keep output column names aligned with the values they actually contain.
- Add focused tests for refund subtraction, calendar-month grouping, and refund-rate denominators.

## Final Notes

This is a useful flawed submission for evaluator training because the code is not obviously broken, yet it violates core business logic in ways that tests and rubric-based review can clearly expose.
