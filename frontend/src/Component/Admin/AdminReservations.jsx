import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaTrash, FaSearch } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import { getAdminReservations, getAdminStats, updateReservationStatus } from '../../api';
import './Admin.css';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReservations();
    loadStats();
    const interval = setInterval(() => {
      loadReservations();
      loadStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadReservations = async () => {
    try {
      const fetched = await getAdminReservations();
      setReservations(fetched);
    } catch (error) {
      console.error('Failed to load admin reservations', error);
      setReservations([]);
    }
  };

  const loadStats = async () => {
    try {
      const fetchedStats = await getAdminStats();
      setStats(fetchedStats);
    } catch (error) {
      console.error('Failed to load admin stats', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await updateReservationStatus(id, 'CANCELLED');
        await loadReservations();
        await loadStats();
      } catch (error) {
        console.error('Failed to cancel reservation', error);
        alert('Unable to cancel reservation. Please try again.');
      }
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.confirmationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.table?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Reservations</h1>
            <p className="admin-description">View and manage all restaurant reservations.</p>
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <p>Total Reservations</p>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card">
            <p>Confirmed</p>
            <strong>{stats.confirmed}</strong>
          </div>
          <div className="stat-card">
            <p>Pending</p>
            <strong>{stats.pending}</strong>
          </div>
          <div className="stat-card">
            <p>Cancelled</p>
            <strong>{stats.cancelled}</strong>
          </div>
        </div>

        <div className="reservations-table">
          <div className="table-header">
            <div className="table-cell">Confirmation ID</div>
            <div className="table-cell">Date & Time</div>
            <div className="table-cell">Guest Name</div>
            <div className="table-cell">Guests</div>
            <div className="table-cell">Table</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="no-reservations">
              <p>No reservations found.</p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation.id} className="table-row">
                <div className="table-cell">
                  <span className="confirmation-id">{reservation.confirmationId}</span>
                </div>
                <div className="table-cell">
                  <div className="date-time-info">
                    <FaCalendarAlt className="info-icon-small" />
                    <span>{reservation.date}</span>
                  </div>
                  <div className="date-time-info">
                    <FaClock className="info-icon-small" />
                    <span>{reservation.time}</span>
                  </div>
                </div>
                <div className="table-cell">
                  <strong>{reservation.name || 'Guest'}</strong>
                </div>
                <div className="table-cell">
                  <FaUsers className="info-icon-small" />
                  {reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}
                </div>
                <div className="table-cell">
                  <FaMapMarkerAlt className="info-icon-small" />
                  {reservation.table}
                </div>
                <div className="table-cell">
                  <span className={`status-badge ${reservation.status || 'confirmed'}`}>
                    {reservation.status ? reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1) : 'Confirmed'}
                  </span>
                </div>
                <div className="table-cell">
                  <button 
                    className="delete-reservation-btn"
                    onClick={() => handleDelete(reservation.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="reservations-summary">
          <p>Total Reservations: <strong>{filteredReservations.length}</strong></p>
        </div>
      </div>
    </AdminLayout>
  );
}

