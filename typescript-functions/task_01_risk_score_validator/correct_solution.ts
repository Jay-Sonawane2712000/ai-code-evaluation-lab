export type RiskRecord = {
  userId: string;
  score: number;
  lastUpdated: string;
  flags?: string[];
};

export type RiskClassification = "low" | "medium" | "high";

export type RiskValidationOptions = {
  staleAfterDays?: number;
  highRiskThreshold?: number;
  mediumRiskThreshold?: number;
  referenceDate?: string | Date;
};

export type ValidatedRiskRecord = RiskRecord & {
  classification: RiskClassification;
  stale: boolean;
};

export type InvalidRiskRecord = {
  record: RiskRecord;
  reasons: string[];
};

export type RiskValidationSummary = {
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

const DEFAULT_OPTIONS = {
  staleAfterDays: 30,
  highRiskThreshold: 80,
  mediumRiskThreshold: 50
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function isValidDate(value: Date): boolean {
  return Number.isFinite(value.getTime());
}

function classifyScore(
  score: number,
  highRiskThreshold: number,
  mediumRiskThreshold: number
): RiskClassification {
  if (score >= highRiskThreshold) {
    return "high";
  }

  if (score >= mediumRiskThreshold) {
    return "medium";
  }

  return "low";
}

function isStale(lastUpdated: Date, referenceDate: Date, staleAfterDays: number): boolean {
  const ageInDays = (referenceDate.getTime() - lastUpdated.getTime()) / MS_PER_DAY;
  return ageInDays > staleAfterDays;
}

function validationReasons(record: RiskRecord): string[] {
  const reasons: string[] = [];

  if (typeof record.userId !== "string" || record.userId.trim().length === 0) {
    reasons.push("userId must be a non-empty string");
  }

  if (!Number.isFinite(record.score) || record.score < 0 || record.score > 100) {
    reasons.push("score must be a finite number from 0 to 100");
  }

  const parsedDate = parseDate(record.lastUpdated);
  if (typeof record.lastUpdated !== "string" || !isValidDate(parsedDate)) {
    reasons.push("lastUpdated must be a valid ISO date string");
  }

  return reasons;
}

export function validateRiskScores(
  records: RiskRecord[],
  options: RiskValidationOptions = {}
): RiskValidationSummary {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const referenceDate = parseDate(config.referenceDate ?? new Date());

  const validRecords: ValidatedRiskRecord[] = [];
  const invalidRecords: InvalidRiskRecord[] = [];

  for (const record of records) {
    const reasons = validationReasons(record);

    if (reasons.length > 0) {
      invalidRecords.push({ record, reasons });
      continue;
    }

    const parsedDate = parseDate(record.lastUpdated);
    const classification = classifyScore(
      record.score,
      config.highRiskThreshold,
      config.mediumRiskThreshold
    );

    validRecords.push({
      ...record,
      userId: record.userId.trim(),
      classification,
      stale: isStale(parsedDate, referenceDate, config.staleAfterDays)
    });
  }

  return {
    totalRecords: records.length,
    validCount: validRecords.length,
    invalidCount: invalidRecords.length,
    highRiskCount: validRecords.filter((record) => record.classification === "high").length,
    mediumRiskCount: validRecords.filter((record) => record.classification === "medium").length,
    lowRiskCount: validRecords.filter((record) => record.classification === "low").length,
    staleCount: validRecords.filter((record) => record.stale).length,
    validRecords,
    invalidRecords
  };
}
