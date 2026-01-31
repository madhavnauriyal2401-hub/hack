
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  UNKNOWN = 'UNKNOWN'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  headline: string;
  summary: string;
  riskFactor: RiskLevel;
  riskScore: number;
  reasons: string[];
  verdict: string;
  careMessage: string; // New field for elder-friendly warnings
  sources: GroundingSource[];
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
