import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUtensils, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBuilding
} from 'react-icons/fa';
import './Admin.css';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaBuilding className="logo-building-icon" />
            <div>
              <h2 className="sidebar-brand">The Gourmet Table</h2>
              <p className="sidebar-subtitle">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin/menu" 
            className={`sidebar-link ${isActive('/admin/menu') ? 'active' : ''}`}
          >
            <FaUtensils className="sidebar-icon" />
            <span>Menu Management</span>
          </Link>
          
          <Link 
            to="/admin/reservations" 
            className={`sidebar-link ${isActive('/admin/reservations') ? 'active' : ''}`}
          >
            <FaCalendarAlt className="sidebar-icon" />
            <span>Reservations</span>
          </Link>
          
          <Link 
            to="/admin/customers" 
            className={`sidebar-link ${isActive('/admin/customers') ? 'active' : ''}`}
          >
            <FaUsers className="sidebar-icon" />
            <span>Customers</span>
          </Link>
          
          <Link 
            to="/admin/analytics" 
            className={`sidebar-link ${isActive('/admin/analytics') ? 'active' : ''}`}
          >
            <FaChartBar className="sidebar-icon" />
            <span>Analytics</span>
          </Link>
          
          <Link 
            to="/admin/settings" 
            className={`sidebar-link ${isActive('/admin/settings') ? 'active' : ''}`}
          >
            <FaCog className="sidebar-icon" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-icon" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

