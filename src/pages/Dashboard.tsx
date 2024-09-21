// src/pages/Dashboard.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CalendarComponent from '../components/Calender/Calender';
import HealthTracker from '../components/HealthTracker/HealthTracker';
import Alerts from '../components/Alerts/Alerts';
import HelpButton from '../components/HelpButton/HelpButton';

const Dashboard: React.FC = () => (
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
              <Link className="nav-link" to="health-tracker">
                Health Tracker
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="alerts">
                Alerts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <HelpButton />

    <Routes>
      <Route path="calendar" element={<CalendarComponent />} />
      <Route path="health-tracker" element={<HealthTracker />} />
      <Route path="alerts" element={<Alerts />} />
    </Routes>
  </div>
);

export default Dashboard;
