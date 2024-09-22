export interface Vitals {
    date: string;
    heartRate: number;
    bloodPressure: { valA: number; valB: number };
    bloodSugar: number;
  }
  
  export interface Medication {
    drug_name: string;
    dosageTime: string; // ISO formatted date-time string
    strength: string; // Use strength to replace dose
    completed: boolean;
  }
  
  export interface User {
    email: string;
    firstName: string;
    lastName: string;
    weight: number;
    age: number;
    vitals: {
      heartRate: { date: string; val: number }[];
      bloodPressure: { date: string; valA: number; valB: number }[];
      bloodSugar: { date: string; val: number }[];
    };
    medications: Medication[];
  }
  
  export interface UpdateVitalsProps {
    email: string | null;
  }
  