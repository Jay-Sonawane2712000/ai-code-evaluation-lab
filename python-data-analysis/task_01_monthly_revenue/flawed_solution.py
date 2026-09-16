"""Plausible but flawed pandas solution for evaluator testing."""

from pathlib import Path
import argparse

import pandas as pd


def load_orders(csv_path):
    df = pd.read_csv(csv_path)
    df["order_date"] = pd.to_datetime(df["order_date"])
    return df


def _with_revenue_fields(df):
    orders = df.copy()
    orders["revenue"] = orders["quantity"] * orders["unit_price"]
    return orders


def calculate_monthly_revenue(df):
    orders = _with_revenue_fields(df)
    monthly = (
        orders.groupby("order_date", as_index=False)["revenue"]
        .sum()
        .rename(columns={"order_date": "month", "revenue": "net_revenue"})
        .sort_values("month")
        .reset_index(drop=True)
    )
    monthly["month"] = monthly["month"].astype(str)
    monthly["net_revenue"] = monthly["net_revenue"].round(2)
    return monthly


def calculate_monthly_refund_rate(df):
    orders = df.copy()
    orders["month"] = orders["order_date"].dt.to_period("M").astype(str)
    grouped = orders.groupby("month")
    refund_rate = grouped.agg(
        completed_orders=("order_status", lambda values: values.eq("completed").sum()),
        refunded_orders=("order_status", lambda values: values.eq("refunded").sum()),
    ).reset_index()
    refund_rate["refund_rate"] = (
        refund_rate["refunded_orders"] / refund_rate["completed_orders"]
    ).round(4)
    return refund_rate.rename(columns={"completed_orders": "total_orders"})


def calculate_top_categories(df, top_n=3):
    orders = _with_revenue_fields(df)
    categories = (
        orders.groupby("product_category", as_index=False)["revenue"]
        .sum()
        .rename(columns={"revenue": "net_revenue"})
    )
    categories["net_revenue"] = categories["net_revenue"].round(2)
    return (
        categories.sort_values(["net_revenue", "product_category"], ascending=[False, True])
        .head(top_n)
        .reset_index(drop=True)
    )


def run_analysis(csv_path):
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
