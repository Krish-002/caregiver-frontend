import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import AWS from 'aws-sdk';
import { saveAs } from 'file-saver'; // For downloading .ics files
import { createEvents, createEvent } from 'ics'; // To generate ICS files

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

  // Function to process the image and get prescription data
  const handleImageUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const imageUrl = await uploadToS3(file);
      const response = await axios.post('http://localhost:5000/process-image', imageUrl);
      const prescriptionData = response.data.custom_parsed_info;

      // Create calendar events from prescriptionData
      const newEvents = generatePrescriptionEvents(prescriptionData);
      setEvents([...events, ...newEvents]); // Update calendar with new events
      setLoading(false);
    } catch (error) {
      console.error("Error processing image:", error);
      setLoading(false);
    }
  };

  // Generate events from the prescription data (simplified)
  const generatePrescriptionEvents = (prescriptionData: any) => {
    const events = [];
    const { drug_name, dosage } = prescriptionData;
    if (drug_name && dosage) {
      const event = {
        start: [2024, 9, 23, 9, 0],
        duration: { hours: 1 },
        title: `Take ${drug_name}`,
        description: `${dosage}`,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
      };
      events.push(event);
    }
    return events;
  };

  // Download the calendar as an .ics file
  const handleDownloadICS = () => {
    createEvents(events, (error : any, value : any) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      saveAs(blob, 'schedule.ics');
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calendar</h2>
      <input type="file" onChange={(e) => setFile(e.target.files![0])} />
      <button className="btn btn-primary mt-2" onClick={handleImageUpload}>
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>
      <button className="btn btn-success mt-2" onClick={handleDownloadICS}>
        Download .ics
      </button>

      <Calendar onChange={handleDateChange} value={date} />
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarComponent;
