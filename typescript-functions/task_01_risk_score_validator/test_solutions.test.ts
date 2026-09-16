import {
  RiskRecord,
  validateRiskScores as validateCorrect
} from "./correct_solution";
import { validateRiskScores as validateFlawed } from "./flawed_solution";

const referenceDate = "2026-09-16T00:00:00.000Z";

function record(overrides: Partial<RiskRecord>): RiskRecord {
  return {
    userId: "user_1",
    score: 25,
    lastUpdated: "2026-09-10T00:00:00.000Z",
    ...overrides
  };
}

describe("correct risk score validator", () => {
  test("correct classifies threshold equality as high and medium", () => {
    const result = validateCorrect(
      [
        record({ userId: "high_equal", score: 80 }),
        record({ userId: "medium_equal", score: 50 }),
        record({ userId: "low", score: 49 })
      ],
      { referenceDate }
    );

    expect(result.validRecords.map((item) => item.classification)).toEqual([
      "high",
      "medium",
      "low"
    ]);
    expect(result.highRiskCount).toBe(1);
    expect(result.mediumRiskCount).toBe(1);
    expect(result.lowRiskCount).toBe(1);
  });

  test("correct rejects NaN and Infinity scores", () => {
    const result = validateCorrect(
      [
        record({ userId: "nan_user", score: Number.NaN }),
        record({ userId: "infinite_user", score: Number.POSITIVE_INFINITY })
      ],
      { referenceDate }
    );

    expect(result.validCount).toBe(0);
    expect(result.invalidCount).toBe(2);
    expect(result.invalidRecords[0].reasons).toContain(
      "score must be a finite number from 0 to 100"
    );
  });

  test("correct validates non-empty userId", () => {
    const result = validateCorrect([record({ userId: "   " })], { referenceDate });

    expect(result.validCount).toBe(0);
    expect(result.invalidRecords[0].reasons).toContain(
      "userId must be a non-empty string"
    );
  });

  test("correct separates invalid records with reasons", () => {
    const result = validateCorrect(
      [record({ userId: "", score: 110, lastUpdated: "not-a-date" })],
      { referenceDate }
    );

    expect(result.invalidCount).toBe(1);
    expect(result.invalidRecords[0].reasons).toEqual([
      "userId must be a non-empty string",
      "score must be a finite number from 0 to 100",
      "lastUpdated must be a valid ISO date string"
    ]);
  });

  test("correct calculates stale records using fixed reference date", () => {
    const result = validateCorrect(
      [
        record({ userId: "fresh", lastUpdated: "2026-09-01T00:00:00.000Z" }),
        record({ userId: "stale", lastUpdated: "2026-08-01T00:00:00.000Z" })
      ],
      { referenceDate, staleAfterDays: 30 }
    );

    expect(result.validRecords.map((item) => item.stale)).toEqual([false, true]);
    expect(result.staleCount).toBe(1);
  });

  test("correct returns accurate summary counts", () => {
    const result = validateCorrect(
      [
        record({ userId: "high", score: 90, lastUpdated: "2026-09-01T00:00:00.000Z" }),
        record({ userId: "medium", score: 65, lastUpdated: "2026-08-01T00:00:00.000Z" }),
        record({ userId: "low", score: 20, lastUpdated: "2026-09-12T00:00:00.000Z" }),
        record({ userId: "", score: 20 })
      ],
      { referenceDate }
    );

    expect(result).toMatchObject({
      totalRecords: 4,
      validCount: 3,
      invalidCount: 1,
      highRiskCount: 1,
      mediumRiskCount: 1,
      lowRiskCount: 1,
      staleCount: 1
    });
  });

  test("correct handles empty input", () => {
    expect(validateCorrect([], { referenceDate })).toMatchObject({
      totalRecords: 0,
      validCount: 0,
      invalidCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      staleCount: 0,
      validRecords: [],
      invalidRecords: []
    });
  });
});

describe("flawed risk score validator seeded bugs", () => {
  test("flawed misses threshold equality classification", () => {
    const records = [
      record({ userId: "high_equal", score: 80 }),
      record({ userId: "medium_equal", score: 50 })
    ];

    const correct = validateCorrect(records, { referenceDate });
    const flawed = validateFlawed(records, { referenceDate });

    expect(correct.validRecords.map((item) => item.classification)).toEqual([
      "high",
      "medium"
    ]);
    expect(flawed.validRecords.map((item) => item.classification)).not.toEqual([
      "high",
      "medium"
    ]);
    expect(flawed.validRecords.map((item) => item.classification)).toEqual([
      "medium",
      "low"
    ]);
  });

  test("flawed accepts non-finite scores", () => {
    const records = [
      record({ userId: "nan_user", score: Number.NaN }),
      record({ userId: "infinite_user", score: Number.POSITIVE_INFINITY })
    ];

    const correct = validateCorrect(records, { referenceDate });
    const flawed = validateFlawed(records, { referenceDate });

    expect(correct.invalidCount).toBe(2);
    expect(flawed.invalidCount).toBe(0);
    expect(flawed.validCount).toBe(2);
  });

  test("flawed miscalculates stale records", () => {
    const records = [
      record({ userId: "stale", lastUpdated: "2026-08-01T00:00:00.000Z" })
    ];

    const correct = validateCorrect(records, { referenceDate, staleAfterDays: 30 });
    const flawed = validateFlawed(records, { referenceDate, staleAfterDays: 30 });

    expect(correct.validRecords[0].stale).toBe(true);
    expect(flawed.validRecords[0].stale).toBe(false);
    expect(flawed.staleCount).toBe(0);
  });
});
