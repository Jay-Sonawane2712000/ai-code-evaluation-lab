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

export type RiskValidationSummary = {
  totalRecords: number;
  validCount: number;
  invalidCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  staleCount: number;
  validRecords: Array<RiskRecord & { classification: RiskClassification; stale: boolean }>;
  invalidRecords: Array<{ record: RiskRecord; reasons: string[] }>;
};

const DEFAULT_OPTIONS = {
  staleAfterDays: 30,
  highRiskThreshold: 80,
  mediumRiskThreshold: 50
};

function classify(score: number, highRiskThreshold: number, mediumRiskThreshold: number): RiskClassification {
  if (score > highRiskThreshold) {
    return "high";
  }

  if (score > mediumRiskThreshold) {
    return "medium";
  }

  return "low";
}

export function validateRiskScores(
  records: RiskRecord[],
  options: RiskValidationOptions = {}
): RiskValidationSummary {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const referenceDate = new Date(config.referenceDate ?? new Date());
  const validRecords: Array<RiskRecord & { classification: RiskClassification; stale: boolean }> = [];
  const invalidRecords: Array<{ record: RiskRecord; reasons: string[] }> = [];

  for (const record of records as any[]) {
    const reasons: string[] = [];

    if (!record.userId) {
      reasons.push("userId is required");
    }

    if (typeof record.score !== "number") {
      reasons.push("score must be numeric");
    }

    const updated = new Date(record.lastUpdated);
    if (Number.isNaN(updated.getTime())) {
      reasons.push("lastUpdated must be valid");
    }

    if (reasons.length > 0) {
      invalidRecords.push({ record, reasons });
      continue;
    }

    const classification = classify(record.score, config.highRiskThreshold, config.mediumRiskThreshold);
    const dayDifference = referenceDate.getDate() - updated.getDate();

    validRecords.push({
      ...record,
      classification,
      stale: dayDifference > config.staleAfterDays
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
