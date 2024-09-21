import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent: React.FC = () => {
  const [date, setDate] = useState<CalendarProps['value']>(new Date());

  const handleDateChange: CalendarProps['onChange'] = (selectedDate) => {
    setDate(selectedDate);
    // Fetch or display events for the selected date
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Calendar</h2>
      <Calendar onChange={handleDateChange} value={date} />
      {/* Display scheduled medicines and appointments here */}
    </div>
  );
};

export default CalendarComponent;
