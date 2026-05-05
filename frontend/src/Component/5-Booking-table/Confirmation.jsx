import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { createReservation } from '../../api';
import { jsPDF } from 'jspdf';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaEnvelope, 
  FaUser,
  FaList,
  FaCalendar,
  FaPrint
} from 'react-icons/fa';
import './Booking.css';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = useMemo(
    () =>
      location.state || {
        fullDate: 'Saturday, October 26, 2024',
        time: '7:30 PM',
        guests: 2,
        table: 'Window Booth',
        contactInfo: {
          fullName: 'Alex Doe',
          emailAddress: 'alexdoe@email.com'
        },
        specialNotes: 'Celebrating an anniversary.'
      },
    [location.state]
  );

  // Use confirmation ID from booking data or generate new one
  const generateConfirmationId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '#RTX';
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const confirmationId = useMemo(
    () => bookingData.confirmationId || generateConfirmationId(),
    [bookingData.confirmationId]
  );
  const savedReservationKey = `reservation_saved_${confirmationId}`;
  const inProgressReservationKey = `reservation_in_progress_${confirmationId}`;

  useEffect(() => {
    if (!bookingData || !location.state) {
      return;
    }

    if (localStorage.getItem(savedReservationKey) || localStorage.getItem(inProgressReservationKey)) {
      return;
    }

    let isMounted = true;
    localStorage.setItem(inProgressReservationKey, 'true');

    const saveReservation = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser?.id) {
          if (isMounted) {
            alert('Please log in before saving your reservation.');
            navigate('/');
          }
          return;
        }

        const resolvedGuests = Number(bookingData.guests) || 1;
        const resolvedTableNumber =
          bookingData.tableNumber != null
            ? Number(bookingData.tableNumber)
            : parseInt(bookingData.table?.match(/\d+/)?.[0], 10) || 1;

        await createReservation({
          confirmationId,
          date: bookingData.date || bookingData.fullDate,
          time: bookingData.time,
          guests: resolvedGuests,
          table: bookingData.table || 'Table 1',
          tableNumber: resolvedTableNumber,
          name: bookingData.contactInfo?.fullName || currentUser.fullName || 'Guest',
          email: currentUser.email || bookingData.contactInfo?.emailAddress || '',
          phone: bookingData.contactInfo?.phoneNumber || '',
          specialNotes: bookingData.specialNotes || '',
          status: 'CONFIRMED',
          userId: currentUser.id
        });

        if (isMounted) {
          localStorage.setItem(savedReservationKey, 'true');
          localStorage.removeItem(inProgressReservationKey);
          setTimeout(() => {
            if (isMounted) {
              navigate('/reservations');
            }
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to save reservation', error);
        localStorage.removeItem(inProgressReservationKey);
        if (isMounted) {
          alert(`Reservation Error: ${error.message}`);
        }
      }
    };

    saveReservation();

    return () => {
      isMounted = false;
    };
  }, [bookingData, confirmationId, inProgressReservationKey, location.state, navigate, savedReservationKey]);

  const maskedEmail = bookingData.contactInfo?.emailAddress
    ? bookingData.contactInfo.emailAddress.charAt(0) + '*****' + bookingData.contactInfo.emailAddress.slice(-9)
    : 'a*****e@email.com';

  const getReservationDate = () => {
    if (bookingData?.date) {
      const parsed = new Date(bookingData.date);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  };

  const parseTimeTo24Hour = (value) => {
    const source = String(value || '').trim();
    const twelveHour = source.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (twelveHour) {
      let hours = Number(twelveHour[1]);
      const minutes = Number(twelveHour[2]);
      const period = twelveHour[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return { hours, minutes };
    }

    const twentyFourHour = source.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHour) {
      return { hours: Number(twentyFourHour[1]), minutes: Number(twentyFourHour[2]) };
    }

    return { hours: 19, minutes: 0 };
  };

  const getReservationDateTimeRange = () => {
    const date = getReservationDate();
    const { hours, minutes } = parseTimeTo24Hour(bookingData.time);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 2);
    return { start, end };
  };

  const formatGoogleCalendarDate = (value) => {
    const date = new Date(value);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const handlePrintReservation = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: [320, 520]
    });

    const customerName = bookingData.contactInfo?.fullName || 'Guest';
    const customerEmail = bookingData.contactInfo?.emailAddress || 'Not provided';

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 320, 520, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('The Gourmet Table', 160, 52, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Reservation Ticket', 160, 70, { align: 'center' });
    doc.setDrawColor(31, 61, 43);
    doc.line(25, 84, 295, 84);

    const lines = [
      ['Confirmation ID', confirmationId],
      ['Date', bookingData.fullDate || getReservationDate().toDateString()],
      ['Time', bookingData.time || '7:00 PM'],
      ['Guests', `${bookingData.guests || 1}`],
      ['Customer', customerName],
      ['Email', customerEmail]
    ];

    let y = 122;
    lines.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${label}:`, 30, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 120, y);
      y += 32;
    });

    // Optional QR placeholder information for scanning/manual lookup.
    doc.setDrawColor(180, 180, 180);
    doc.rect(110, 325, 100, 100);
    doc.setFontSize(9);
    doc.text('QR (optional)', 160, 438, { align: 'center' });
    doc.text(`Ref: ${confirmationId}`, 160, 454, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Please present this ticket at arrival.', 160, 482, { align: 'center' });

    doc.save(`reservation-${confirmationId.replace('#', '')}.pdf`);
  };

  const handleAddToCalendar = () => {
    const { start, end } = getReservationDateTimeRange();
    const customerName = bookingData.contactInfo?.fullName || 'Guest';
    const customerEmail = bookingData.contactInfo?.emailAddress || '';
    const description = [
      `Reservation ID: ${confirmationId}`,
      `Guest name: ${customerName}`,
      `Number of guests: ${bookingData.guests || 1}`,
      `Email: ${customerEmail || 'Not provided'}`
    ].join('\n');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      'Restaurant Reservation'
    )}&dates=${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent('The Gourmet Table, 123 Culinary Lane')}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="booking-page">
      <Header />
      <div className="confirmation-container">
        <div className="confirmation-icon">
          <FaCheckCircle />
        </div>
        <h1 className="confirmation-title">Your Reservation is Confirmed!</h1>
        <p className="confirmation-subtitle">
          A confirmation email has been sent to your registered email address with all the details of your booking.
        </p>

        <div className="confirmation-card">
          {/* Restaurant Information */}
          <div className="restaurant-info">
            <h2 className="restaurant-name">The Gourmet Table</h2>
            <p className="restaurant-address">123 Culinary Lane, Foodie City, 90210</p>
            <p className="confirmation-id">Confirmation ID: {confirmationId}</p>
          </div>

          {/* Reservation Details Grid */}
          <div className="reservation-details-grid">
            <div className="reservation-details-column">
              <div className="reservation-detail-item">
                <FaCalendarAlt className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Date</span>
                  <span className="reservation-value">{bookingData.fullDate}</span>
                </div>
              </div>

              <div className="reservation-detail-item">
                <FaUsers className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Guests</span>
                  <span className="reservation-value">{bookingData.guests} people</span>
                </div>
              </div>

              <div className="reservation-detail-item">
                <FaEnvelope className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Contact</span>
                  <span className="reservation-value">{maskedEmail}</span>
                </div>
              </div>
            </div>

            <div className="reservation-details-column">
              <div className="reservation-detail-item">
                <FaClock className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Time</span>
                  <span className="reservation-value">{bookingData.time}</span>
                </div>
              </div>

              <div className="reservation-detail-item">
                <FaUser className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Reserved For</span>
                  <span className="reservation-value">{bookingData.contactInfo?.fullName || 'Alex Doe'}</span>
                </div>
              </div>

              <div className="reservation-detail-item">
                <FaList className="reservation-icon" />
                <div className="reservation-detail-content">
                  <span className="reservation-label">Special Requests</span>
                  <span className="reservation-value">
                    {bookingData.specialNotes || 'Celebrating an anniversary.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button className="add-calendar-btn" onClick={handleAddToCalendar}>
            <FaCalendar />
            Add to Calendar
          </button>
          <button className="print-btn" onClick={handlePrintReservation}>
            <FaPrint />
            Print Reservation
          </button>
        </div>

        {/* Policy Text */}
        <p className="confirmation-policy">
          Need to make a change? Please{' '}
          <a href="#contact" className="policy-link">contact us directly</a>.{' '}
          <a href="#policy" className="policy-link">View our cancellation policy</a>.
        </p>

        <p className="confirmation-copyright">
          © 2024 The Gourmet Table. All Rights Reserved.
        </p>
      </div>
      <Footer />
    </div>
  );
}

