import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Outlet, Navigate } from 'react-router-dom'; // Don't use Routes/Route inside here
import { Line } from 'react-chartjs-2';
import HelpButton from '../components/HelpButton/HelpButton';
import Charts from '../components/Charts/Charts';
import { useAuthInfo, useLogoutFunction } from '@propelauth/react';
import localData from '/Users/krishbansal/2024/caregiver-app/src/Data/users.json'; // Import local JSON data

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
import MedList from '../components/MedList/MedList';
import UpdateVitals from '../components/UpdateVitals/UpdateVitals';
import Profile from '../components/Profile/Profile';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuthInfo();
  const logout = useLogoutFunction();

  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    if (user?.email) {
      // Find the user data from local JSON based on logged-in user's email
      const currentUser = localData.find((u: any) => u.email === user.email);
      if (currentUser) {
        setUserData(currentUser);
      }
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>You are not logged in. Please login to access the dashboard.</div>;
  }

  if (!userData) {
    return <div>No data available for the user.</div>;
  }

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
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            MedMate
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="medlist">
                  Medication List
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="update-vitals">
                  Update Vitals
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="profile">
                  Profile
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">Welcome, {user?.email}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger" onClick={() => logout(false)}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <HelpButton />

      <div className="container mt-4">
      <Routes>
          {/* Default to charts when at /dashboard */}
          <Route path="/" element={<Navigate to="charts" replace />} />
          <Route path="charts" element={<Charts userData={userData} />} />
          <Route path="medlist" element={<MedList />} />
          <Route path="update-vitals" element={<UpdateVitals email={user?.email} />} />
          <Route path="profile" element={<Profile email={user?.email}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
