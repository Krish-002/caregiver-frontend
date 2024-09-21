// src/components/Alerts/Alerts.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Alert {
  id: number;
  message: string;
  date: string;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Fetch alerts from API
    axios.get('/api/alerts').then((response) => {
      setAlerts(response.data);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Alerts</h2>
      <ul className="list-group">
        {alerts.map((alert) => (
          <li key={alert.id} className="list-group-item">
            <strong>{alert.date}:</strong> {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
