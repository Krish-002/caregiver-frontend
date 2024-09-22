import React from 'react';
import { Line } from 'react-chartjs-2';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Charts: React.FC<{ userData: any }> = ({ userData }) => {
  // Prepare chart data for heart rate, blood pressure, and blood sugar
  const heartRateData = {
    labels: userData.vitals.heartRate.map((hr: any) => hr.date),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: userData.vitals.heartRate.map((hr: any) => hr.val),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const bloodPressureData = {
    labels: userData.vitals.bloodPressure.map((bp: any) => bp.date),
    datasets: [
      {
        label: 'Systolic (mmHg)',
        data: userData.vitals.bloodPressure.map((bp: any) => bp.valA),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Diastolic (mmHg)',
        data: userData.vitals.bloodPressure.map((bp: any) => bp.valB),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const bloodSugarData = {
    labels: userData.vitals.bloodSugar.map((sugar: any) => sugar.date),
    datasets: [
      {
        label: 'Blood Sugar (mg/dL)',
        data: userData.vitals.bloodSugar.map((sugar: any) => sugar.val),
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  return (
    <div className="container mt-4">
      {/* Render Heart Rate Chart */}
      <div className="mb-5">
        <h4>Heart Rate Over Time</h4>
        <Line data={heartRateData} options={{ responsive: true }} />
      </div>

      {/* Render Blood Pressure Chart */}
      <div className="mb-5">
        <h4>Blood Pressure Over Time</h4>
        <Line data={bloodPressureData} options={{ responsive: true }} />
      </div>

      {/* Render Blood Sugar Chart */}
      <div className="mb-5">
        <h4>Blood Sugar Over Time</h4>
        <Line data={bloodSugarData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Charts;
