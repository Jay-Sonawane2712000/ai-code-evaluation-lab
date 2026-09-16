"""Correct pandas solution for the monthly revenue analysis task."""

from pathlib import Path
import argparse

import pandas as pd


def load_orders(csv_path):
    """Load ecommerce orders and parse order dates."""
    df = pd.read_csv(csv_path)
    df["order_date"] = pd.to_datetime(df["order_date"])
    return df


def _with_revenue_fields(df):
    result = df.copy()
    result["gross_revenue"] = result["quantity"] * result["unit_price"]
    result["signed_revenue"] = result["gross_revenue"]
    refunded_mask = result["order_status"].eq("refunded")
    result.loc[refunded_mask, "signed_revenue"] *= -1
    result["month"] = result["order_date"].dt.to_period("M").astype(str)
    return result


def calculate_monthly_revenue(df):
    """Return net revenue by calendar month."""
    orders = _with_revenue_fields(df)
    monthly = (
        orders.groupby("month", as_index=False)["signed_revenue"]
        .sum()
        .rename(columns={"signed_revenue": "net_revenue"})
        .sort_values("month")
        .reset_index(drop=True)
    )
    monthly["net_revenue"] = monthly["net_revenue"].round(2)
    return monthly


def calculate_monthly_refund_rate(df):
    """Return refunded order count divided by total order count by month."""
    orders = _with_revenue_fields(df)
    grouped = orders.groupby("month")
    refund_rate = grouped.agg(
        total_orders=("order_id", "count"),
        refunded_orders=("order_status", lambda values: values.eq("refunded").sum()),
    ).reset_index()
    refund_rate["refund_rate"] = (
        refund_rate["refunded_orders"] / refund_rate["total_orders"]
    ).round(4)
    return refund_rate.sort_values("month").reset_index(drop=True)


def calculate_top_categories(df, top_n=3):
    """Return product categories ranked by net revenue descending."""
    orders = _with_revenue_fields(df)
    categories = (
        orders.groupby("product_category", as_index=False)["signed_revenue"]
        .sum()
        .rename(columns={"signed_revenue": "net_revenue"})
    )
    categories["net_revenue"] = categories["net_revenue"].round(2)
    return (
        categories.sort_values(["net_revenue", "product_category"], ascending=[False, True])
        .head(top_n)
        .reset_index(drop=True)
    )


def run_analysis(csv_path):
    """Run all requested analysis outputs."""
    orders = load_orders(csv_path)
    return {
        "monthly_revenue": calculate_monthly_revenue(orders),
        "monthly_refund_rate": calculate_monthly_refund_rate(orders),
        "top_categories": calculate_top_categories(orders),
    }


def parse_args():
    parser = argparse.ArgumentParser(description="Analyze ecommerce order revenue.")
    parser.add_argument(
        "csv_path",
        nargs="?",
        default=Path(__file__).parents[2] / "data" / "ecommerce_orders.csv",
        help="Path to ecommerce_orders.csv.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    analysis = run_analysis(args.csv_path)
    for name, dataframe in analysis.items():
        print(f"\n{name}")
        print(dataframe.to_string(index=False))


if __name__ == "__main__":
    main()
