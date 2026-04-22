import React from 'react';
import './Home.css';

export default function BookingWidget() {
  const bookingData = {
    date: 'July 5, 2024',
    time: '7:00 PM',
    guests: '2 People'
  };

  return (
    <div className="booking-widget">
      <h2 className="booking-title">Book a Table</h2>
      <div className="booking-inputs">
        <div className="booking-input-group">
          <div className="booking-value">{bookingData.date}</div>
          <div className="booking-label">Selected Date</div>
        </div>
        <div className="booking-input-group">
          <div className="booking-value">{bookingData.time}</div>
          <div className="booking-label">Selected Time</div>
        </div>
        <div className="booking-input-group">
          <div className="booking-value">{bookingData.guests}</div>
          <div className="booking-label">Number of Guests</div>
        </div>
      </div>
      <button className="btn-find-table">Find a Table</button>
    </div>
  );
}

