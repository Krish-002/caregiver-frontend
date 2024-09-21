// src/pages/Register.tsx
import React from 'react';
import { useRedirectFunctions } from '@propelauth/react';

const Register: React.FC = () => {
  const { redirectToSignupPage } = useRedirectFunctions();

  const handleSignup = () => {
    redirectToSignupPage({ postSignupRedirectUrl: window.location.href });
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <button className="btn btn-primary" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default Register;
