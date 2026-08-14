import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// หมายเหตุ: AppDataProvider ไม่ได้ครอบทั้งแอปแบบเดิมแล้ว
// เพราะแต่ละเซิฟต้องมีข้อมูลของตัวเอง จึงย้ายไปครอบเฉพาะหน้าที่อยู่ใต้ /s/:serverId
// ผ่าน <ServerScope> แทน (ดูที่ src/App.jsx และ src/components/ServerScope.jsx)
// AuthProvider ครอบทั้งแอปตรงนี้เลย เพราะสถานะ login ใช้ร่วมกันทุกเซิฟ
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
