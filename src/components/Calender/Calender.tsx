import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import AWS from 'aws-sdk';
import { saveAs } from 'file-saver'; // For downloading .ics files
import { createEvents } from 'ics'; // To generate ICS files

// Configure AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<CalendarProps['value']>(new Date());
  const [events, setEvents] = useState<any[]>([]); // Store calendar events
  const [file, setFile] = useState<File | null>(null); // Store selected file
  const [loading, setLoading] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<string | null>(null); // Store warnings to show popup
  const [showAlert, setShowAlert] = useState<boolean>(false); // To control popup visibility

  // Handle date change for the calendar
  const handleDateChange: CalendarProps['onChange'] = (selectedDate) => {
    setDate(selectedDate);
  };

  // Function to upload image to S3 and return its URL
  const uploadToS3 = async (file: File): Promise<string> => {
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME!,
      Key: `${Date.now()}_${file.name}`,
      Body: file,
      ContentType: file.type,
    };
    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse.Location;
  };

  // Function to process the image and get prescription data from the backend Flask API
  const handleImageUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Upload the image to S3 and get the URL
      const imageUrl = await uploadToS3(file);
      console.log('Image URL:', imageUrl);

      // Send the image URL to the Flask API for processing
      const response = await axios.post('http://127.0.0.1:5000/process-image', imageUrl, {
        headers: {
          'Content-Type': 'text/plain',
        },
        withCredentials: false,
      });

      console.log('Response:', response.data);
      // Get the prescription data from the response
      const prescriptionData = response.data.cleaned_info;
      console.log('Prescription data:', prescriptionData);

      // Set the warnings for alert popup
      setWarnings(prescriptionData.shortened_warnings);
      setShowAlert(true); // Show alert with warnings

      // Create calendar events from the prescription data
      const newEvents = generatePrescriptionEvents(prescriptionData);
      setEvents([...events, ...newEvents]); // Update calendar with new events
      setLoading(false);
    } catch (error) {
      console.error("Error processing image:", error);
      setLoading(false);
    }
  };

  // Function to generate events from the prescription data (dynamically)
  const generatePrescriptionEvents = (prescriptionData: any) => {
    const events:any = [];
    const { drug_name, strength, dosage_schedule } = prescriptionData;

    // Parse the dosage schedule (it's a string of array format)
    const dosageTimes = JSON.parse(dosage_schedule); // Convert to array

    // Generate calendar events based on dosage schedule
    dosageTimes.forEach((dosageTime: string) => {
      const eventStart = new Date(dosageTime); // Convert string to Date object

      const event = {
        start: [
          eventStart.getFullYear(),
          eventStart.getMonth() + 1, // JavaScript months are 0-indexed
          eventStart.getDate(),
          eventStart.getHours(),
          eventStart.getMinutes(),
        ],
        duration: { hours: 1 }, // Example 1-hour duration
        title: `Take ${drug_name} (${strength})`,
        description: `Scheduled dosage for ${drug_name} (${strength})`,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
      };

      events.push(event);
    });

    return events;
  };

  // Function to download the calendar events as an .ics file
  const handleDownloadICS = () => {
    createEvents(events, (error: any, value: any) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, 'schedule.ics');
    });
  };

  // Function to close the warnings alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calendar</h2>

      {/* File input for image upload */}
      <input type="file" onChange={(e) => setFile(e.target.files![0])} />

      {/* Button to upload image and process prescription */}
      <button className="btn btn-primary mt-2" onClick={handleImageUpload}>
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>

      {/* Button to download the generated .ics file */}
      <button className="btn btn-success mt-2" onClick={handleDownloadICS}>
        Download .ics
      </button>

      {/* Calendar component to display selected date */}
      <Calendar onChange={handleDateChange} value={date} />

      {/* Display generated events */}
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.title}</li>
        ))}
      </ul>

      {/* Alert Popup for Warnings */}
      {showAlert && warnings && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Warning!</strong> {warnings}
          <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAlert}></button>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
