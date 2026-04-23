import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaUserCircle } from 'react-icons/fa';
import './Home.css';

export default function Header() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const displayName = currentUser?.username || currentUser?.fullName;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsProfileOpen(false);
    navigate('/');
  };

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
          <div className="header-actions">
            <button
              className="btn-book-header"
              onClick={() => navigate('/booking')}
            >
              Book a Table
            </button>
            <div className="profile-menu-wrapper" ref={profileRef}>
              <button
                type="button"
                className="profile-icon-btn"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                <FaUserCircle className="profile-icon" />
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <p className="profile-dropdown-label">Signed in as</p>
                  <p className="profile-dropdown-email">{currentUser?.email || 'Guest'}</p>
                  {displayName && (
                    <p className="profile-dropdown-username">{displayName}</p>
                  )}
                  <button
                    type="button"
                    className="profile-logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
