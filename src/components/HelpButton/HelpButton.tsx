// src/components/HelpButton/HelpButton.tsx
import React from 'react';
import axios from 'axios';

const HelpButton: React.FC = () => {
  const handleClick = () => {
    // Send a help request to the backend
    axios.post('/api/help').then(() => {
      alert('Help request sent!');
    });
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-danger rounded-circle"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        fontSize: '1.5rem',
      }}
    >
      &#x1F6A8;
    </button>
  );
};

export default HelpButton;
