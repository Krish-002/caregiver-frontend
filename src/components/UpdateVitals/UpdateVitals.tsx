import React, { useState } from 'react';
import localData from '/Users/krishbansal/2024/caregiver-app/src/Data/users.json'; // Import local JSON data
import axios from 'axios';

// Define User and Vitals Interfaces
interface Vitals {
  date: string;
  heartRate: number;
  bloodPressure: { valA: number; valB: number };
  bloodSugar: number;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  vitals: {
    heartRate: { date: string; val: number }[];
    bloodPressure: { date: string; valA: number; valB: number }[];
    bloodSugar: { date: string; val: number }[];
  };
}

interface UpdateVitalsProps {
  email: string | null; // Email passed as prop from the Dashboard
}

const UpdateVitals: React.FC<UpdateVitalsProps> = ({ email }) => {
  const [date, setDate] = useState<string>('');
  const [heartRate, setHeartRate] = useState<number>(0);
  const [bloodPressureA, setBloodPressureA] = useState<number>(0);
  const [bloodPressureB, setBloodPressureB] = useState<number>(0);
  const [bloodSugar, setBloodSugar] = useState<number>(0);

  const handleSubmit = async () => {
    if (!email) {
      alert('No user email found!');
      return;
    }

    // Fetch the current user data from local JSON
    const users: User[] = [...localData];
    const user = users.find((user) => user.email === email);

    if (!user) {
      alert('User not found!');
      return;
    }

    // Prepare new vital entry
    const newVitals: Vitals = {
      date,
      heartRate,
      bloodPressure: {
        valA: bloodPressureA,
        valB: bloodPressureB,
      },
      bloodSugar,
    };

    // Push new values into the user's vitals arrays
    user.vitals.heartRate.push({ date, val: heartRate });
    user.vitals.bloodPressure.push({
      date,
      valA: bloodPressureA,
      valB: bloodPressureB,
    });

    user.vitals.bloodSugar.push({ date, val: bloodSugar });

    try {
      // Send the updated data to the Flask backend
      const response = await axios.post('http://127.0.0.1:5000/update-users', users, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Vitals updated successfully!');
      } else {
        alert('Error updating vitals!');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Error updating file!');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Vitals</h2>

      {/* Date and Time Selection */}
      <div className="mb-3">
        <label className="form-label">Date and Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Heart Rate Input */}
      <div className="mb-3">
        <label className="form-label">Heart Rate (bpm)</label>
        <input
          type="number"
          className="form-control"
          value={heartRate}
          onChange={(e) => setHeartRate(Number(e.target.value))}
        />
      </div>

      {/* Blood Pressure A (Systolic) Input */}
      <div className="mb-3">
        <label className="form-label">Blood Pressure A (Systolic)</label>
        <input
          type="number"
          className="form-control"
          value={bloodPressureA}
          onChange={(e) => setBloodPressureA(Number(e.target.value))}
        />
      </div>

      {/* Blood Pressure B (Diastolic) Input */}
      <div className="mb-3">
        <label className="form-label">Blood Pressure B (Diastolic)</label>
        <input
          type="number"
          className="form-control"
          value={bloodPressureB}
          onChange={(e) => setBloodPressureB(Number(e.target.value))}
        />
      </div>

      {/* Blood Sugar Input */}
      <div className="mb-3">
        <label className="form-label">Blood Sugar (mg/dL)</label>
        <input
          type="number"
          className="form-control"
          value={bloodSugar}
          onChange={(e) => setBloodSugar(Number(e.target.value))}
        />
      </div>

      {/* Submit Button */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Save Vitals
      </button>
    </div>
  );
};

export default UpdateVitals;
