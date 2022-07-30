import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'https://roll-dice-game-backend.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
