import React, { useState } from 'react';
import localData from '/Users/maxencegilloteaux/ComputerScience/Personal/Hackathons/caregiver/src/Data/users.json'; // Import local JSON data
import { User, UpdateVitalsProps } from '../types';
import axios from 'axios';

const UpdateProfile: React.FC<UpdateVitalsProps> = ({ email }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  
  const handleSubmit = async () => {
    if (!email) {
      alert('No user email found!');
      return;
    }

    const users: User[] = [...localData];
    const user = users.find((user) => user.email === email);

    if (!user) {
      alert('User not found!');
      return;
    }

    // Update user info
    user.firstName = firstName;
    user.lastName = lastName;
    user.weight = weight;
    user.age = age;

    try {
      // Send the updated data to the Flask backend
      const response = await axios.post('http://127.0.0.1:5000/update-users', users, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('User information updated successfully!');
      } else {
        alert('Error updating user information!');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Error updating file!');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Profile</h2>

      {/* First Name Input */}
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* Last Name Input */}
      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Age</label>
        <input
          type="text"
          className="form-control"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Weight</label>
        <input
          type="text"
          className="form-control"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
      </div>

      {/* Submit Button */}
      <button className="btn btn-primary" onClick={handleSubmit}>
        Save Profile
      </button>
    </div>
  );
};

export default UpdateProfile;
