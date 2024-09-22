import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Configure AWS SDK with environment variables
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const MedList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]); // Store medication tasks
  const [file, setFile] = useState<File | null>(null); // Store selected file
  const [loading, setLoading] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<string | null>(null); // Store warnings to show popup
  const [showAlert, setShowAlert] = useState<boolean>(false); // To control popup visibility

  // Function to request permission for notifications
  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  };

  // Set up notifications for each task
  const scheduleNotifications = (tasks: any[]) => {
    tasks.forEach((task) => {
      const now = new Date();
      const taskTime = new Date(task.dosageTime);
      const notificationTime = new Date(taskTime.getTime() - 30 * 60 * 1000); // 30 minutes before

      const timeUntilNotification = notificationTime.getTime() - now.getTime();

      if (timeUntilNotification > 0) {
        setTimeout(() => {
          showNotification(task.drug_name, task.dosageTime);
        }, timeUntilNotification);
      }
    });
  };

  // Function to show notification
  const showNotification = (drugName: string, dosageTime: Date) => {
    new Notification(`Reminder: Time to take ${drugName}`, {
      body: `You have a scheduled dosage of ${drugName} at ${dosageTime.toLocaleTimeString()}`,
      icon: '/path-to-icon.png', // You can add an icon if desired
    });
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

      // Get the prescription data from the response
      const prescriptionData = response.data.cleaned_info;

      // Set the warnings for alert popup
      setWarnings(prescriptionData.shortened_warnings);
      setShowAlert(true); // Show alert with warnings

      // Create tasks from the prescription data
      const newTasks = generateMedicationTasks(prescriptionData);
      setTasks((prevTasks) => [...prevTasks, ...newTasks]); // Update tasks with new tasks
      setLoading(false);

      // Schedule notifications for the new tasks
      scheduleNotifications(newTasks);
    } catch (error) {
      console.error('Error processing image:', error);
      setLoading(false);
    }
  };

  // Function to generate tasks from the prescription data
  const generateMedicationTasks = (prescriptionData: any) => {
    const { drug_name, strength, dosage_schedule } = prescriptionData;
    const dosageTimes = JSON.parse(dosage_schedule); // Convert to array

    // Generate tasks based on dosage schedule
    const tasks = dosageTimes.map((dosageTime: string) => {
      const dosageDate = new Date(dosageTime); // Convert string to Date object
      return {
        id: dosageTime, // Use dosageTime as a unique identifier
        drug_name,
        strength,
        dosageTime: dosageDate,
        completed: false,
      };
    });

    return tasks;
  };

  // Function to handle task completion toggle
  const handleTaskToggle = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed }; // Toggle the 'completed' state
        }
        return task;
      })
    );
  };

  // Sort tasks by completed status and dosageTime
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return a.dosageTime.getTime() - b.dosageTime.getTime();
    }
    return a.completed ? 1 : -1;
  });

  // Function to close the warnings alert
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Medication To-Do List</h2>

      {/* File input for image upload */}
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files![0])}
        />
      </div>

      {/* Button to upload image and process prescription */}
      <button
        className="btn btn-primary mb-3"
        onClick={handleImageUpload}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Processing...
          </>
        ) : (
          'Upload & Process'
        )}
      </button>

      {/* Alert Popup for Warnings */}
      {showAlert && warnings && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Warning!</strong> {warnings}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleCloseAlert}
          ></button>
        </div>
      )}

      {/* Display task list */}
      <ul className="list-group mt-4">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.completed ? 'bg-light text-muted' : ''
            }`}
          >
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                id={`task-${task.id}`}
              />
              <label
                className={`form-check-label ms-2 ${
                  task.completed ? 'text-decoration-line-through' : ''
                }`}
                htmlFor={`task-${task.id}`}
              >
                <strong>{task.drug_name}</strong> ({task.strength}) at{' '}
                {task.dosageTime.toLocaleString()}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedList;
