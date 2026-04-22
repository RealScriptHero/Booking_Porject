import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Booking.css';

export default function BookYourTable() {
  const navigate = useNavigate();
  const today = new Date();
  const currentMonthIndex = today.getMonth();
  const currentYearValue = today.getFullYear();
  const currentDay = today.getDate();
  
  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedTime, setSelectedTime] = useState('6:30 PM');
  const [selectedTable, setSelectedTable] = useState('Table 5');
  const [guests, setGuests] = useState(2);
  const [currentMonth, setCurrentMonth] = useState(currentMonthIndex);
  const [currentYear, setCurrentYear] = useState(currentYearValue);

  const timeSlots = [
    '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
    '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM'
  ];

  const tables = [
    { id: 'table5', name: 'Table 5', seats: 'Seats 2-4 people', type: 'Window Seat' },
    { id: 'table8', name: 'Table 8', seats: 'Seats 4-6 people', type: 'Booth' },
    { id: 'table12', name: 'Table 12', seats: 'Seats 2 people', type: 'Patio' }
  ];

  // All dates are available - no restrictions
  const handleConfirm = () => {
    navigate('/booking/details', {
      state: {
        date: selectedDate,
        month: currentMonth,
        year: currentYear,
        time: selectedTime,
        table: selectedTable,
        guests: guests
      }
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (currentMonth === 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    } else {
      newMonth = currentMonth - 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Adjust selected date if it doesn't exist in new month
    const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
    if (selectedDate > daysInNewMonth) {
      setSelectedDate(daysInNewMonth);
    }
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (currentMonth === 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    } else {
      newMonth = currentMonth + 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // Adjust selected date if it doesn't exist in new month
    const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
    if (selectedDate > daysInNewMonth) {
      setSelectedDate(daysInNewMonth);
    }
  };

  return (
    <div className="booking-page">
      <Header />
      <div className="booking-container">
        <h1 className="booking-page-title">Book Your Table</h1>
        
        <div className="booking-content">
          {/* Left Panel - Calendar */}
          <div className="calendar-panel">
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                <FaChevronLeft />
              </button>
              <h3 className="calendar-month-year">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button className="calendar-nav-btn" onClick={handleNextMonth}>
                <FaChevronRight />
              </button>
            </div>
            <div className="calendar-weekdays">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>
            <div className="calendar-grid">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const today = new Date();
                const todayYear = today.getFullYear();
                const todayMonth = today.getMonth();
                const todayDay = today.getDate();
                
                // Compare dates: check if this date is before today
                let isPast = false;
                if (currentYear < todayYear) {
                  isPast = true;
                } else if (currentYear === todayYear && currentMonth < todayMonth) {
                  isPast = true;
                } else if (currentYear === todayYear && currentMonth === todayMonth && day < todayDay) {
                  isPast = true;
                }
                
                const isSelected = day === selectedDate;
                
                return (
                  <button
                    key={day}
                    type="button"
                    className={`calendar-day ${
                      isSelected ? 'selected' : 
                      isPast ? 'disabled' : 
                      'available'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isPast) {
                        setSelectedDate(day);
                      }
                    }}
                    disabled={isPast}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Time and Table Selection */}
          <div className="booking-panel">
            <div className="guests-selector">
              <label className="guests-label">Number of Guests</label>
              <select 
                className="guests-dropdown"
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
            </div>

            <div className="time-selection">
              <h3 className="section-title">
                Available Times for {monthNames[currentMonth]} {selectedDate}
              </h3>
              <div className="time-slots">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${time === selectedTime ? 'selected' : ''} ${
                      time === '7:45 PM' ? 'unavailable' : ''
                    }`}
                    onClick={() => time !== '7:45 PM' && setSelectedTime(time)}
                    disabled={time === '7:45 PM'}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-selection">
              <h3 className="section-title">Select an Available Table</h3>
              <div className="table-cards">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`table-card ${selectedTable === table.name ? 'selected' : ''}`}
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <div className="table-info">
                      <h4 className="table-name">{table.name}</h4>
                      <p className="table-seats">{table.seats}</p>
                    </div>
                    <span className="table-type">{table.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="confirm-reservation-btn" onClick={handleConfirm}>
              Confirm Reservation
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

