const DEFAULT_OPTIONS = {
  refundCountThreshold: 3,
  refundRatioThreshold: 0.5,
  rollingWindowHours: 24,
};

function hasGlobalRefundVelocity(transactions, rollingWindowHours) {
  const windowMs = rollingWindowHours * 60 * 60 * 1000;
  const refundTimes = transactions
    .filter((transaction) => transaction.type === "refund")
    .map((transaction) => new Date(transaction.timestamp).getTime());

  for (let i = 1; i < refundTimes.length; i += 1) {
    if (refundTimes[i] - refundTimes[i - 1] <= windowMs) {
      return true;
    }
  }

  return false;
}

function findSuspiciousRefundUsers(transactions, options = {}) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  const users = {};

  for (const transaction of transactions) {
    if (!users[transaction.userId]) {
      users[transaction.userId] = {
        userId: transaction.userId,
        refundCount: 0,
        totalRefundAmount: 0,
        totalPurchaseAmount: 0,
      };
    }

    if (transaction.type === "purchase") {
      users[transaction.userId].totalPurchaseAmount += transaction.amount;
    }

    if (transaction.type === "refund") {
      users[transaction.userId].refundCount += 1;
      users[transaction.userId].totalRefundAmount += transaction.amount;
    }
  }

  const globalVelocity = hasGlobalRefundVelocity(
    transactions,
    config.rollingWindowHours
  );

  return Object.values(users)
    .filter((user) => user.refundCount > 0)
    .map((user) => {
      const refundRatio =
        user.totalPurchaseAmount === 0
          ? 0
          : user.totalRefundAmount / user.totalPurchaseAmount;
      const reasons = [];

      if (user.refundCount > config.refundCountThreshold) {
        reasons.push("REFUND_COUNT");
      }

      if (globalVelocity) {
        reasons.push("REFUND_VELOCITY");
      }

      return {
        userId: user.userId,
        refundCount: user.refundCount,
        totalRefundAmount: Math.round(user.totalRefundAmount * 100) / 100,
        totalPurchaseAmount: Math.round(user.totalPurchaseAmount * 100) / 100,
        refundRatio: Math.round(refundRatio * 10000) / 10000,
        reasons,
      };
    })
    .filter((user) => user.reasons.length > 0);
}

module.exports = { findSuspiciousRefundUsers };
