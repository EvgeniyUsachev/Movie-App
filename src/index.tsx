import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

fetch('https://api.themoviedb.org/3/search/movie?api_key=7d0349337e7da854b0da94f99185e198&query=return&page=1')
  .then((response) => response.json())
  .then((data) => console.log(data));
