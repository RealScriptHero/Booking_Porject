import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import './Home.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon">
            <FaUtensils className="logo-icon-svg" />
          </div>
          <span className="logo-text">The Gourmet Table</span>
        </div>
        <nav className="nav">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/reservations" className="nav-link">Reservations</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button 
            className="btn-book-header"
            onClick={() => navigate('/booking')}
          >
            Book a Table
          </button>
        </nav>
      </div>
    </header>
  );
}
