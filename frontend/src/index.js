import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Check if the environment variable is accessible


const baseURL = axios.create({
  baseURL: 'http//localhost:8081',
});
// console.log('REACT_APP_SERVER_BASE_URL:', baseURL.baseURL);
export default baseURL;

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
