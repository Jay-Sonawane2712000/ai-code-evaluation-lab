const DEFAULT_OPTIONS = {
  refundCountThreshold: 3,
  refundRatioThreshold: 0.5,
  rollingWindowHours: 24,
};

function roundAmount(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundRatio(value) {
  if (!Number.isFinite(value)) {
    return value;
  }
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

function hasRefundVelocity(refundTimestamps, rollingWindowHours) {
  if (refundTimestamps.length < 2) {
    return false;
  }

  const windowMs = rollingWindowHours * 60 * 60 * 1000;
  const sortedTimes = refundTimestamps
    .map((timestamp) => new Date(timestamp).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((a, b) => a - b);

  for (let i = 1; i < sortedTimes.length; i += 1) {
    if (sortedTimes[i] - sortedTimes[i - 1] <= windowMs) {
      return true;
    }
  }

  return false;
}

function createUserStats(userId) {
  return {
    userId,
    refundCount: 0,
    totalRefundAmount: 0,
    totalPurchaseAmount: 0,
    refundTimestamps: [],
  };
}

function findSuspiciousRefundUsers(transactions, options = {}) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  const users = new Map();

  for (const transaction of transactions) {
    if (!transaction || !transaction.userId) {
      continue;
    }

    if (!users.has(transaction.userId)) {
      users.set(transaction.userId, createUserStats(transaction.userId));
    }

    const stats = users.get(transaction.userId);
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "purchase") {
      stats.totalPurchaseAmount += amount;
    } else if (transaction.type === "refund") {
      stats.refundCount += 1;
      stats.totalRefundAmount += amount;
      stats.refundTimestamps.push(transaction.timestamp);
    }
  }

  const suspiciousUsers = [];

  for (const stats of users.values()) {
    const refundRatio =
      stats.totalPurchaseAmount === 0
        ? stats.totalRefundAmount > 0
          ? Infinity
          : 0
        : stats.totalRefundAmount / stats.totalPurchaseAmount;

    const reasons = [];

    if (stats.refundCount >= config.refundCountThreshold) {
      reasons.push("REFUND_COUNT");
    }

    if (refundRatio >= config.refundRatioThreshold) {
      reasons.push("REFUND_RATIO");
    }

    if (hasRefundVelocity(stats.refundTimestamps, config.rollingWindowHours)) {
      reasons.push("REFUND_VELOCITY");
    }

    if (reasons.length > 0) {
      suspiciousUsers.push({
        userId: stats.userId,
        refundCount: stats.refundCount,
        totalRefundAmount: roundAmount(stats.totalRefundAmount),
        totalPurchaseAmount: roundAmount(stats.totalPurchaseAmount),
        refundRatio: roundRatio(refundRatio),
        reasons,
      });
    }
  }

  return suspiciousUsers.sort((a, b) => a.userId.localeCompare(b.userId));
}

module.exports = { findSuspiciousRefundUsers };
