
export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export interface HealthAdvice {
  summary: string;
  recommendations: string[];
  dietTips: string[];
}
