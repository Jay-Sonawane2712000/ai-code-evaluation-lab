# Task 01: Monthly Revenue Analysis

## Objective

Analyze ecommerce order data and produce monthly revenue, monthly refund-rate, and top-category summaries. Your solution should be written in Python using pandas and should be easy to test.

## Dataset Path

Use the dataset at:

```text
../../data/ecommerce_orders.csv
```

## Column Descriptions

| Column | Description |
| --- | --- |
| order_id | Unique order identifier. |
| customer_id | Synthetic customer identifier. |
| order_date | Date the order was placed. |
| product_category | Product category for the order. |
| order_status | Order status. Expected values include `completed` and `refunded`. |
| quantity | Number of units in the order. |
| unit_price | Price per unit. |

## Business Rules

- Revenue per row is `quantity * unit_price`.
- Completed orders add positive revenue.
- Refunded orders subtract revenue from net revenue.
- Monthly grouping must use calendar month in `YYYY-MM` format.
- Monthly refund rate is `refunded order count / total order count` for that month.
- Top product categories should be ranked by net revenue descending.
- Monetary outputs should be rounded to 2 decimals where appropriate.

## Required Output Format

Create reusable functions that return testable pandas DataFrames:

- Monthly net revenue with columns `month` and `net_revenue`.
- Monthly refund rate with columns `month`, `total_orders`, `refunded_orders`, and `refund_rate`.
- Top product categories with columns `product_category` and `net_revenue`.

Also include a `run_analysis(csv_path)` helper that returns all three outputs in a dictionary.

## Edge Cases to Consider

- Refunded orders should reduce revenue rather than increase it.
- Multiple orders in the same calendar month may occur on different days.
- Month-boundary dates such as the last day of one month and first day of the next should not be merged.
- Zero-quantity rows should contribute zero revenue while still counting as orders.
- Refund rate should use all orders in the month as the denominator, not only completed orders.

## Expected Deliverables

- A clean, correct pandas solution.
- A plausible flawed solution for evaluator testing.
- Pytest tests that verify the correct solution and expose the flawed solution's seeded bugs.
- A written evaluation using the shared 25-point rubric.
