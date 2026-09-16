const correctSolution = require("./correct_solution");
const flawedSolution = require("./flawed_solution");

const { findSuspiciousRefundUsers } = correctSolution;

function txn(transactionId, userId, type, amount, timestamp) {
  return { transactionId, userId, type, amount, timestamp };
}

describe("correct_solution", () => {
  test("correct handles empty transactions", () => {
    expect(findSuspiciousRefundUsers([])).toEqual([]);
  });

  test("correct flags user by refund count threshold", () => {
    const transactions = [
      txn("t1", "user_b", "purchase", 300, "2026-06-01T09:00:00Z"),
      txn("t2", "user_b", "refund", 20, "2026-06-02T09:00:00Z"),
      txn("t3", "user_b", "refund", 30, "2026-06-04T09:00:00Z"),
      txn("t4", "user_b", "refund", 40, "2026-06-06T09:00:00Z"),
    ];

    expect(findSuspiciousRefundUsers(transactions)).toEqual([
      {
        userId: "user_b",
        refundCount: 3,
        totalRefundAmount: 90,
        totalPurchaseAmount: 300,
        refundRatio: 0.3,
        reasons: ["REFUND_COUNT"],
      },
    ]);
  });

  test("correct flags user by refund ratio threshold", () => {
    const transactions = [
      txn("t1", "user_ratio", "purchase", 100, "2026-06-01T09:00:00Z"),
      txn("t2", "user_ratio", "refund", 50, "2026-06-03T09:00:00Z"),
    ];

    expect(findSuspiciousRefundUsers(transactions)).toEqual([
      {
        userId: "user_ratio",
        refundCount: 1,
        totalRefundAmount: 50,
        totalPurchaseAmount: 100,
        refundRatio: 0.5,
        reasons: ["REFUND_RATIO"],
      },
    ]);
  });

  test("correct detects refund velocity per user", () => {
    const transactions = [
      txn("t1", "user_velocity", "purchase", 200, "2026-06-01T09:00:00Z"),
      txn("t2", "user_velocity", "refund", 10, "2026-06-10T09:00:00Z"),
      txn("t3", "user_velocity", "refund", 15, "2026-06-10T20:00:00Z"),
    ];

    expect(findSuspiciousRefundUsers(transactions)).toEqual([
      {
        userId: "user_velocity",
        refundCount: 2,
        totalRefundAmount: 25,
        totalPurchaseAmount: 200,
        refundRatio: 0.125,
        reasons: ["REFUND_VELOCITY"],
      },
    ]);
  });

  test("correct returns stable userId-sorted output", () => {
    const transactions = [
      txn("t1", "user_c", "purchase", 100, "2026-06-01T09:00:00Z"),
      txn("t2", "user_c", "refund", 60, "2026-06-02T09:00:00Z"),
      txn("t3", "user_a", "purchase", 100, "2026-06-01T09:00:00Z"),
      txn("t4", "user_a", "refund", 60, "2026-06-02T09:00:00Z"),
      txn("t5", "user_b", "purchase", 100, "2026-06-01T09:00:00Z"),
      txn("t6", "user_b", "refund", 60, "2026-06-02T09:00:00Z"),
    ];

    const result = findSuspiciousRefundUsers(transactions);

    expect(result.map((user) => user.userId)).toEqual([
      "user_a",
      "user_b",
      "user_c",
    ]);
  });

  test("correct handles users with refunds but no purchases without crashing", () => {
    const transactions = [
      txn("t1", "user_refund_only", "refund", 25, "2026-06-01T09:00:00Z"),
    ];

    expect(findSuspiciousRefundUsers(transactions)).toEqual([
      {
        userId: "user_refund_only",
        refundCount: 1,
        totalRefundAmount: 25,
        totalPurchaseAmount: 0,
        refundRatio: Infinity,
        reasons: ["REFUND_RATIO"],
      },
    ]);
  });
});

describe("flawed_solution seeded bugs", () => {
  test("flawed misses threshold equality case", () => {
    const transactions = [
      txn("t1", "user_count", "purchase", 300, "2026-06-01T09:00:00Z"),
      txn("t2", "user_count", "refund", 20, "2026-06-02T09:00:00Z"),
      txn("t3", "user_count", "refund", 30, "2026-06-04T09:00:00Z"),
      txn("t4", "user_count", "refund", 40, "2026-06-06T09:00:00Z"),
    ];

    const result = flawedSolution.findSuspiciousRefundUsers(transactions);

    expect(result).toEqual([]);
  });

  test("flawed misses refund-ratio-only suspicious user", () => {
    const transactions = [
      txn("t1", "user_ratio", "purchase", 100, "2026-06-01T09:00:00Z"),
      txn("t2", "user_ratio", "refund", 70, "2026-06-03T09:00:00Z"),
    ];

    const result = flawedSolution.findSuspiciousRefundUsers(transactions);

    expect(result).toEqual([]);
  });

  test("flawed misclassifies refund velocity globally instead of per user", () => {
    const transactions = [
      txn("t1", "user_a", "purchase", 1000, "2026-06-01T09:00:00Z"),
      txn("t2", "user_a", "refund", 10, "2026-06-01T10:00:00Z"),
      txn("t3", "user_b", "purchase", 1000, "2026-06-01T09:00:00Z"),
      txn("t4", "user_b", "refund", 10, "2026-06-01T12:00:00Z"),
    ];

    const correctResult = findSuspiciousRefundUsers(transactions);
    const flawedResult = flawedSolution.findSuspiciousRefundUsers(transactions);

    expect(correctResult).toEqual([]);
    expect(flawedResult.map((user) => user.userId)).toEqual([
      "user_a",
      "user_b",
    ]);
    expect(flawedResult[0].reasons).toEqual(["REFUND_VELOCITY"]);
  });
});
