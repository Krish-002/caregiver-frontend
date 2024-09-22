// src/pages/AddPatient.tsx

import React, { useState } from 'react';
import axios from 'axios';

const AddPatient: React.FC = () => {
    const [patientData, setPatientData] = useState({
        name: '',
        dob: '',
        medications: '',
        diagnosis: '',
        last_visit_date: '',
        contact_info: '',
        address: '',
        doctor_assigned: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/add_patient', patientData);
            console.log('Patient added:', response.data);
            // Optionally reset the form or redirect
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add Patient</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(patientData).map((key) => (
                    <div className="mb-3" key={key}>
                        <label className="form-label">{key.replace(/_/g, ' ').toUpperCase()}</label>
                        <input
                            type={key === 'dob' ? 'date' : 'text'}
                            className="form-control"
                            name={key}
                            value={patientData[key as keyof typeof patientData]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Add Patient</button>
            </form>
        </div>
    );
};

export default AddPatient;
