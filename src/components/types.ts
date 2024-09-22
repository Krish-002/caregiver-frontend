export interface Vitals {
    date: string;
    heartRate: number;
    bloodPressure: { valA: number; valB: number };
    bloodSugar: number;
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
  }
  
  export interface UpdateVitalsProps {
    email: string | null;
  }
