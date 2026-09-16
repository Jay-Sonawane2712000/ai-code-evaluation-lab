from pathlib import Path

import pandas as pd

import correct_solution
import flawed_solution


DATA_PATH = Path(__file__).parents[2] / "data" / "ecommerce_orders.csv"


def sample_orders():
    return pd.DataFrame(
        {
            "order_id": [1, 2, 3, 4, 5, 6],
            "customer_id": ["C1", "C2", "C3", "C4", "C5", "C6"],
            "order_date": pd.to_datetime(
                [
                    "2026-01-31",
                    "2026-01-15",
                    "2026-02-01",
                    "2026-02-20",
                    "2026-02-20",
                    "2026-03-05",
                ]
            ),
            "product_category": [
                "Electronics",
                "Electronics",
                "Home",
                "Home",
                "Apparel",
                "Apparel",
            ],
            "order_status": [
                "completed",
                "refunded",
                "completed",
                "refunded",
                "completed",
                "completed",
            ],
            "quantity": [1, 1, 2, 1, 0, 2],
            "unit_price": [100.0, 40.0, 25.0, 10.0, 99.0, 20.0],
        }
    )


def value_for_month(df, month):
    return df.loc[df["month"].eq(month), "net_revenue"].iloc[0]


def test_correct_monthly_revenue_subtracts_refunds():
    result = correct_solution.calculate_monthly_revenue(sample_orders())

    assert value_for_month(result, "2026-01") == 60.0
    assert value_for_month(result, "2026-02") == 40.0


def test_flawed_monthly_revenue_counts_refunds_positive():
    result = flawed_solution.calculate_monthly_revenue(sample_orders())
    january_rows = result[result["month"].str.startswith("2026-01")]

    assert january_rows["net_revenue"].sum() == 140.0
    assert january_rows["net_revenue"].sum() != 60.0


def test_correct_groups_by_calendar_month():
    result = correct_solution.calculate_monthly_revenue(sample_orders())

    assert list(result["month"]) == ["2026-01", "2026-02", "2026-03"]
    assert len(result) == 3


def test_flawed_groups_by_raw_order_date():
    result = flawed_solution.calculate_monthly_revenue(sample_orders())

    assert "2026-01" not in set(result["month"])
    assert {"2026-01-15", "2026-01-31"}.issubset(set(result["month"]))
    assert len(result) > 3


def test_correct_refund_rate_uses_total_orders():
    result = correct_solution.calculate_monthly_refund_rate(sample_orders())
    february = result[result["month"].eq("2026-02")].iloc[0]

    assert february["total_orders"] == 3
    assert february["refunded_orders"] == 1
    assert february["refund_rate"] == 0.3333


def test_flawed_refund_rate_uses_wrong_denominator():
    result = flawed_solution.calculate_monthly_refund_rate(sample_orders())
    february = result[result["month"].eq("2026-02")].iloc[0]

    assert february["total_orders"] == 2
    assert february["refund_rate"] == 0.5
    assert february["refund_rate"] != 0.3333


def test_top_categories_rank_by_net_revenue():
    result = correct_solution.calculate_top_categories(sample_orders(), top_n=2)

    assert list(result["product_category"]) == ["Electronics", "Apparel"]
    assert list(result["net_revenue"]) == [60.0, 40.0]


def test_correct_solution_runs_against_real_csv():
    orders = correct_solution.load_orders(DATA_PATH)
    analysis = correct_solution.run_analysis(DATA_PATH)

    assert len(orders) == 80
    assert list(analysis) == [
        "monthly_revenue",
        "monthly_refund_rate",
        "top_categories",
    ]
    assert set(analysis["monthly_revenue"]["month"]) == {
        "2026-01",
        "2026-02",
        "2026-03",
        "2026-04",
        "2026-05",
    }
    assert len(analysis["top_categories"]) == 3
