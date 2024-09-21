// src/components/HealthTracker/HealthTracker.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import axios from 'axios';

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale
);

interface HealthData {
  date: string;
  bloodPressure: number;
  glucoseLevel: number;
}

const HealthTracker: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);

  useEffect(() => {
    // Fetch health data from API
    axios.get('/api/health-data').then((response) => {
      setHealthData(response.data);
    });
  }, []);

  const data = {
    labels: healthData.map((data) => data.date),
    datasets: [
      {
        label: 'Blood Pressure',
        data: healthData.map((data) => data.bloodPressure),
        borderColor: 'red',
        fill: false,
      },
      {
        label: 'Glucose Level',
        data: healthData.map((data) => data.glucoseLevel),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day',
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Health Tracker</h2>
      <Line data={data} />
      {/* Optionally, add forms to input new health data */}
    </div>
  );
};

export default HealthTracker;
