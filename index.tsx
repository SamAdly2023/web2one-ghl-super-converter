import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../src/services/firebaseClient';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Google Client ID - Set this in your .env file or Render environment variables
// To get a Client ID: https://console.cloud.google.com/apis/credentials
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
