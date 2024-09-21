// src/pages/Login.tsx
import React from 'react';
import { useRedirectFunctions } from '@propelauth/react';

const Login: React.FC = () => {
  const { redirectToLoginPage } = useRedirectFunctions();

  const handleLogin = () => {
    redirectToLoginPage({ postLoginRedirectUrl: window.location.href });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
