import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import { getMyReservations, deleteReservation } from '../../api';
import './Reservations.css';

export default function Reservations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservations, setReservations] = useState([]);

  const loadReservations = useCallback(async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (!currentUser?.id) {
        navigate('/');
        return;
      }

      const savedReservations = await getMyReservations(currentUser.id);
      setReservations(savedReservations);
    } catch (error) {
      console.error('Failed to load reservations', error);
      setReservations([]);
    }
  }, [navigate]);

  useEffect(() => {
    loadReservations();
    
    // Listen for storage changes (when new reservations are added from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'reservations') {
        loadReservations();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for focus event (when user returns to this tab)
    window.addEventListener('focus', loadReservations);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadReservations);
    };
  }, [loadReservations]);

  // Reload reservations when navigating to this page
  useEffect(() => {
    loadReservations();
  }, [location.pathname, loadReservations]);

  const handleDeleteReservation = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation? This will remove it from the database.')) {
      try {
        await deleteReservation(id);
        await loadReservations();
      } catch (error) {
        console.error('Failed to delete reservation', error);
        alert('Unable to delete the reservation. Please try again.');
      }
    }
  };

  return (
    <div className="reservations-page">
      <Header />
      <div className="reservations-container">
        <div className="reservations-header">
          <h1 className="reservations-title">My Reservations</h1>
          <button 
            className="new-reservation-btn"
            onClick={() => navigate('/booking')}
          >
            Book a New Table
          </button>
        </div>

        {reservations.length === 0 ? (
          <div className="no-reservations">
            <p>You don't have any reservations yet.</p>
            <button 
              className="book-now-btn"
              onClick={() => navigate('/booking')}
            >
              Book a Table
            </button>
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <div className="reservation-id">
                    <span className="id-label">Confirmation ID:</span>
                    <span className="id-value">{reservation.confirmationId}</span>
                  </div>
                  <span className={`reservation-status ${reservation.status}`}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </div>

                <div className="reservation-details">
                  <div className="reservation-detail-row">
                    <FaCalendarAlt className="detail-icon" />
                    <span className="detail-text">{reservation.date}</span>
                  </div>
                  <div className="reservation-detail-row">
                    <FaClock className="detail-icon" />
                    <span className="detail-text">{reservation.time}</span>
                  </div>
                  <div className="reservation-detail-row">
                    <FaUsers className="detail-icon" />
                    <span className="detail-text">{reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  <div className="reservation-detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span className="detail-text">{reservation.table}</span>
                  </div>
                  <div className="reservation-detail-row">
                    <span className="guest-name-label">Reserved for:</span>
                    <span className="guest-name">{reservation.name}</span>
                  </div>
                </div>

                <div className="reservation-actions">
                  <button 
                    className="cancel-reservation-btn"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    <FaTrash />
                    Delete Reservation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

