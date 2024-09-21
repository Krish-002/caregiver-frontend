import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { RequiredAuthProvider } from '@propelauth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const authUrl = process.env.REACT_APP_AUTH_URL;

if (!authUrl) {
  throw new Error('REACT_APP_AUTH_URL is not set. Please set it in your .env file.');
}

const App: React.FC = () => (
  <RequiredAuthProvider
    authUrl={authUrl} // Pass the validated URL
    displayWhileLoading={<div>Loading...</div>}
    displayIfLoggedOut={<Login />}
  >
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  </RequiredAuthProvider>
);

export default App;
