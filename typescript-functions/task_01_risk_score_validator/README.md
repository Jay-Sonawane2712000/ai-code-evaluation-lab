# Task 01: Risk Score Validator

## Objective

Write a TypeScript function that validates and classifies user risk score records. The function should separate valid and invalid records, classify valid records into risk bands, identify stale records, and return accurate summary counts.

## Type Definitions

```ts
type RiskRecord = {
  userId: string;
  score: number;
  lastUpdated: string;
  flags?: string[];
};

type RiskValidationOptions = {
  staleAfterDays?: number;
  highRiskThreshold?: number;
  mediumRiskThreshold?: number;
  referenceDate?: string | Date;
};
```

Preferred function signature:

```ts
validateRiskScores(
  records: RiskRecord[],
  options?: RiskValidationOptions
): RiskValidationSummary
```

## Business Rules

1. `score` must be a finite number from `0` to `100` inclusive.
2. `userId` must be a non-empty string.
3. `lastUpdated` must be a valid ISO date string.
4. A record is stale if `lastUpdated` is more than `staleAfterDays` before the reference date.
5. Tests should use a fixed reference date so results are deterministic.
6. Risk classification:
   - `high`: `score >= highRiskThreshold`
   - `medium`: `score >= mediumRiskThreshold` and `score < highRiskThreshold`
   - `low`: `score < mediumRiskThreshold`
7. Invalid records should be returned separately with reasons.
8. Valid records should be returned with classification and stale status.
9. Summary counts should include total, valid, invalid, high-risk, medium-risk, low-risk, and stale counts.

## Default Options

```ts
{
  staleAfterDays: 30,
  highRiskThreshold: 80,
  mediumRiskThreshold: 50
}
```

## Required Output Shape

```ts
type RiskClassification = "low" | "medium" | "high";

type ValidatedRiskRecord = RiskRecord & {
  classification: RiskClassification;
  stale: boolean;
};

type InvalidRiskRecord = {
  record: RiskRecord;
  reasons: string[];
};

type RiskValidationSummary = {
  totalRecords: number;
  validCount: number;
  invalidCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  staleCount: number;
  validRecords: ValidatedRiskRecord[];
  invalidRecords: InvalidRiskRecord[];
};
```

## Edge Cases to Consider

- Empty input should return zero counts and empty arrays.
- Scores at exactly `80` and `50` should classify correctly with default thresholds.
- `NaN`, `Infinity`, scores below `0`, and scores above `100` should be invalid.
- Empty or whitespace-only `userId` should be invalid.
- Invalid dates should be returned with clear reasons.
- Stale checks should use a deterministic reference date in tests.
- A record may have multiple validation errors.

## Expected Deliverables

- A strictly typed correct TypeScript implementation.
- A plausible flawed TypeScript implementation for evaluator testing.
- Jest tests that verify the correct solution and expose seeded bugs in the flawed solution.
- A written evaluation using the shared 25-point rubric.
