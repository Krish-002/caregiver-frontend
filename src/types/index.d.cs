// src/types/index.d.ts
export interface Alert {
  id: number;
  message: string;
  date: string;
}

export interface HealthData {
  date: string;
  bloodPressure: number;
  glucoseLevel: number;
}
