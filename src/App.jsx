import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand__icon">
            <i className="bx bx-flask-round" style={{ color: '#bbb5ba' }} />
          </span>
          <span className="navbar-brand__text">
            <span className="navbar-brand__title">Potion for Galleon</span>
            <span className="navbar-brand__tagline">Recipes & Material Calculator</span>
          </span>
        </Link>
      </nav>
      <main className="container app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p className="site-footer__text">
            © 2026 <span className="site-footer__author">Kernelxz</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
