// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// src/index.tsx or src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default App;
