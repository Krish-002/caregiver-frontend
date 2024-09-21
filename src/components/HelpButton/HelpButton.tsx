import React from 'react';

const HelpButton: React.FC = () => {
  const handleClick = () => {
    // Ask for confirmation before dialing 911
    const confirmed = window.confirm('Are you sure you want to call 911?');
    
    if (confirmed) {
      // Open the phone dialer with 911 pre-filled
      window.location.href = 'tel:911';
    }
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
