import React, { useState } from 'react';
import localData from '/Users/krishbansal/2024/caregiver-app/src/Data/users.json'; // Import local JSON data
import { saveAs } from 'file-saver'; // Used for saving the updated JSON file

interface Vitals {
  date: string;
  heartRate: number;
  bloodPressure: string;
  bloodSugar: number;
}

interface UpdateVitalsProps {
  email: string | null; // Email passed as prop from the Dashboard
}

const UpdateVitals: React.FC<UpdateVitalsProps> = ({ email }) => {
  const [date, setDate] = useState<string>('');
  const [heartRate, setHeartRate] = useState<number>(0);
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [bloodSugar, setBloodSugar] = useState<number>(0);

  const handleSubmit = () => {
    if (!email) {
      alert('No user email found!');
      return;
    }

    // Fetch the current user data from local JSON
    const users = [...localData]; // Deep copy the local data
    const user = users.find((user) => user.email === email);

    if (!user) {
      alert('User not found!');
      return;
    }

    // Prepare new vital entry
    const newVitals: Vitals = {
      date,
      heartRate,
      bloodPressure,
      bloodSugar,
    };

    // Update the user's vitals
    if (!user.vitals) {
      user.vitals = {
        heartRate: [],
        bloodPressure: [],
        bloodSugar: [],
      };
    }

    user.vitals.heartRate.push({ date, val: heartRate });
    user.vitals.bloodPressure.push({ date, val: bloodPressure });
    user.vitals.bloodSugar.push({ date, val: bloodSugar });

    // Save the updated data to JSON file
    const updatedData = JSON.stringify(users, null, 2);
    const blob = new Blob([updatedData], { type: 'application/json' });
    saveAs(blob, 'users.json'); // Save the updated JSON file (overwrite)

    alert('Vitals updated successfully!');
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

      {/* Blood Pressure Input */}
      <div className="mb-3">
        <label className="form-label">Blood Pressure (e.g., 120/80)</label>
        <input
          type="text"
          className="form-control"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
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
