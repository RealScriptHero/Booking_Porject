import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function BookingWidget() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('7:00 PM');
  const [guests, setGuests] = useState(2);

  const handleFindTable = () => {
    navigate('/booking', {
      state: {
        date,
        time,
        guests
      }
    });
  };

  return (
    <div className="booking-widget">
      <h2 className="booking-title">Book a Table</h2>
      <div className="booking-inputs">
        <div className="booking-input-group">
          <input
            className="booking-value"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="booking-label">Selected Date</div>
        </div>
        <div className="booking-input-group">
          <select
            className="booking-value"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="6:00 PM">6:00 PM</option>
            <option value="6:15 PM">6:15 PM</option>
            <option value="6:30 PM">6:30 PM</option>
            <option value="6:45 PM">6:45 PM</option>
            <option value="7:00 PM">7:00 PM</option>
            <option value="7:15 PM">7:15 PM</option>
            <option value="7:30 PM">7:30 PM</option>
            <option value="7:45 PM">7:45 PM</option>
            <option value="8:00 PM">8:00 PM</option>
          </select>
          <div className="booking-label">Selected Time</div>
        </div>
        <div className="booking-input-group">
          <select
            className="booking-value"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            <option value={1}>1 person</option>
            <option value={2}>2 people</option>
            <option value={3}>3 people</option>
            <option value={4}>4 people</option>
            <option value={5}>5 people</option>
            <option value={6}>6 people</option>
          </select>
          <div className="booking-label">Number of Guests</div>
        </div>
      </div>
      <button className="btn-find-table" onClick={handleFindTable}>Find a Table</button>
    </div>
  );
}

