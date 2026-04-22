import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { FaCalendarAlt, FaTable, FaUsers } from 'react-icons/fa';
import './Booking.css';

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {
    date: 26,
    month: 9,
    year: 2024,
    time: '7:30 PM',
    table: 'Table 5',
    guests: 2
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const [guests, setGuests] = useState(
    typeof bookingData.guests === 'string'
      ? Number(bookingData.guests.replace(/\D/g, '')) || 2
      : bookingData.guests || 2
  );
  const [contactInfo, setContactInfo] = useState({
    fullName: currentUser?.fullName || 'John Doe',
    phoneNumber: currentUser?.phone || '',
    emailAddress: currentUser?.email || 'you@example.com'
  });
  const [specialNotes, setSpecialNotes] = useState('');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = new Date(bookingData.year, bookingData.month, bookingData.date);
  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[bookingData.month];
  const fullDate = `${dayName}, ${monthName} ${bookingData.date}, ${bookingData.year}`;

  const handleGuestsChange = (delta) => {
    const newGuests = guests + delta;
    if (newGuests >= 1 && newGuests <= 10) {
      setGuests(newGuests);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleConfirm = () => {
    if (!contactInfo.fullName || !contactInfo.emailAddress) {
      alert('Please fill in your full name and email address.');
      return;
    }

    // Generate confirmation ID
    const generateConfirmationId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '#RTX';
      for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const confirmationId = generateConfirmationId();
    const reservationDate = date.toISOString();
    const tableNumber = parseInt(bookingData.table.match(/\d+/)?.[0] || '1', 10);

    navigate('/booking/confirmation', {
      state: {
        ...bookingData,
        guests,
        contactInfo,
        specialNotes,
        fullDate,
        confirmationId,
        date: reservationDate,
        tableNumber
      }
    });
  };

  return (
    <div className="booking-page">
      <Header />
      <div className="booking-details-container">
        <h1 className="booking-details-title">Your Booking Details</h1>
        
        <div className="booking-details-card">
          {/* Reservation Details Section */}
          <div className="details-section">
            <h2 className="section-heading">Reservation Details</h2>
            
            <div className="detail-item">
              <div className="detail-left">
                <FaCalendarAlt className="detail-icon" />
                <span className="detail-text">{fullDate} at {bookingData.time}</span>
              </div>
              <button className="edit-btn" onClick={() => navigate('/booking')}>Edit</button>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaTable className="detail-icon" />
                <span className="detail-text">{bookingData.table}</span>
              </div>
              <button className="edit-btn" onClick={() => navigate('/booking')}>Edit</button>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaUsers className="detail-icon" />
                <span className="detail-text">Number of Guests</span>
              </div>
              <div className="guests-counter">
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestsChange(-1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="guests-input"
                  value={guests}
                  readOnly
                />
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestsChange(1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="details-section">
            <h2 className="section-heading">Contact Information (Optional)</h2>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={contactInfo.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-input"
                value={contactInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="emailAddress"
                className="form-input"
                value={contactInfo.emailAddress}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="details-section">
            <h2 className="section-heading">Additional Information</h2>
            
            <div className="form-group">
              <label className="form-label">Special Notes or Requests</label>
              <textarea
                className="form-textarea"
                placeholder="e.g., dietary restrictions, celebrating an anniversary"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="booking-details-footer">
            <p className="policy-text">
              By confirming, you agree to our restaurant's reservation policy.
            </p>
            <div className="action-buttons">
              <button 
                className="cancel-btn"
                onClick={() => navigate('/booking')}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleConfirm}
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

