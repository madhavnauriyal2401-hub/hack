export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  UNKNOWN = 'UNKNOWN'
}

export enum SecurityModule {
  HOME = 'HOME',
  NEWS = 'NEWS',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  URL = 'URL',
  PAYMENT = 'PAYMENT',
  VICTIM_HELP = 'VICTIM_HELP',
  MEETING_LINK = 'MEETING_LINK',
  JOB_FRAUD = 'JOB_FRAUD',
  AWARENESS_HUB = 'AWARENESS_HUB',
  ABOUT_US = 'ABOUT_US',
  WHY_US = 'WHY_US',
  GUIDELINES = 'GUIDELINES'
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
  careMessage: string;
  sources: GroundingSource[];
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}

export interface FraudStep {
  title: string;
  action: string;
  icon: any;
}

export interface FraudTypeGuide {
  id: string;
  label: string;
  icon: any;
  steps: FraudStep[];
}