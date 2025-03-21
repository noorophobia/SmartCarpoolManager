import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the global CSS file for styling
import './index.css';
// Import the main App component (the root of our React application)
import App from './App';
// Create a root DOM node 
 const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component inside the root element
// <React.StrictMode>  highlights potential issues and runs components twice in dev to catch side effects
// like Deprecated APIs
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


 