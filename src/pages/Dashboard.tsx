import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CalendarComponent from '../components/Calender/Calender';
import UpdateVitals from '../components/UpdateVitals/UpdateVitals'; // Replace HealthTracker with UpdateVitals
import Alerts from '../components/Profile/Profile';
import HelpButton from '../components/HelpButton/HelpButton';
import { useAuthInfo, useLogoutFunction } from '@propelauth/react';

const Dashboard: React.FC = () => {
  const { user, isLoggedIn, loading } = useAuthInfo();
  const logout = useLogoutFunction();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>You are not logged in. Please login to access the dashboard.</div>;
  }

  console.log(user);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            Caregiver App
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
                <Link className="nav-link" to="calendar">
                  Calendar
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="update-vitals">
                  Update Vitals
                </Link> {/* Replace the link for health-tracker */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="alerts">
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

      <div className="container mt-4">
        <Routes>
          <Route path="calendar" element={<CalendarComponent />} />
          <Route path="update-vitals" element={<UpdateVitals email={user?.email} />} /> {/* Pass the email as a prop */}
          <Route path="alerts" element={<Alerts />} />
        </Routes>
      </div>
      <HelpButton />
    </div>
  );
};

export default Dashboard;
