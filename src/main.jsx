import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import App from './App.jsx';
import './index.css';
import { AppDataProvider } from './context/AppDataContext.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BrowserRouter>
        <AppDataProvider>
          <App />
        </AppDataProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
