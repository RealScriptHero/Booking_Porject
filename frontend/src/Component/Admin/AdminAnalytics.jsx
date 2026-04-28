import React, { useEffect, useMemo, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import AdminLayout from './AdminLayout';
import { getAdminAnalytics, getAdminReservations } from '../../api';
import './Admin.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsResult, reservationsResult] = await Promise.all([getAdminAnalytics(), getAdminReservations()]);
      setAnalytics(analyticsResult);
      setReservations(reservationsResult);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const usersGrowthChartData = useMemo(() => {
    if (!analytics?.usersGrowth) return null;
    return {
      labels: analytics.usersGrowth.map((item) => item.day),
      datasets: [
        {
          label: 'Total Users',
          data: analytics.usersGrowth.map((item) => item.totalUsers),
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.15)',
          tension: 0.3
        }
      ]
    };
  }, [analytics]);

  const reservationsPerDayData = useMemo(() => {
    if (!analytics?.reservationsPerDay) return null;
    return {
      labels: analytics.reservationsPerDay.map((item) => item.day),
      datasets: [
        {
          label: 'Reservations',
          data: analytics.reservationsPerDay.map((item) => item.total),
          backgroundColor: '#27ae60'
        }
      ]
    };
  }, [analytics]);

  const reservationsByGuestsData = useMemo(() => {
    if (!analytics?.reservationsByGuests) return null;
    const labels = Object.keys(analytics.reservationsByGuests);
    const values = Object.values(analytics.reservationsByGuests);
    return {
      labels: labels.map((label) => `${label} guests`),
      datasets: [
        {
          data: values,
          backgroundColor: ['#2ecc71', '#27ae60', '#1f8a4d', '#145a32', '#0b3d1f']
        }
      ]
    };
  }, [analytics]);

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#22302b',
          font: {
            size: 11,
            weight: '600'
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#4a5c53', maxRotation: 0, autoSkip: true, maxTicksLimit: 6 },
        grid: { color: 'rgba(34, 48, 43, 0.08)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#4a5c53' },
        grid: { color: 'rgba(34, 48, 43, 0.08)' }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#22302b',
          font: {
            size: 11,
            weight: '600'
          }
        }
      }
    }
  };

  const handleExportReservationsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reservations Report', 14, 15);
    autoTable(doc, {
      startY: 22,
      head: [['Confirmation', 'Customer', 'Email', 'Date', 'Time', 'Guests', 'Table', 'Status']],
      body: reservations.map((reservation) => [
        reservation.confirmationId,
        reservation.name || reservation.user?.fullName || 'Guest',
        reservation.email || reservation.user?.email || '-',
        new Date(reservation.date).toLocaleDateString(),
        reservation.time,
        reservation.guests,
        reservation.table,
        reservation.status
      ])
    });
    doc.save('reservations-report.pdf');
  };

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Analytics</h1>
            <p className="admin-description">Track customer growth and reservation performance.</p>
          </div>
          <button className="add-item-btn" onClick={handleExportReservationsPdf}>
            <FaDownload />
            Export Reservations PDF
          </button>
        </div>

        {loading ? <div className="no-reservations">Loading analytics...</div> : null}
        {error ? <div className="no-reservations">{error}</div> : null}

        {!loading && !error && analytics ? (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <p>Total Users</p>
                <strong>{analytics.totals.users}</strong>
                <span className="stat-subtitle">All registered accounts</span>
              </div>
              <div className="stat-card">
                <p>Total Reservations</p>
                <strong>{analytics.totals.reservations}</strong>
                <span className="stat-subtitle">Bookings created so far</span>
              </div>
              <div className="stat-card">
                <p>Confirmed</p>
                <strong>{analytics.totals.confirmed}</strong>
                <span className="stat-subtitle">Ready to serve</span>
              </div>
              <div className="stat-card">
                <p>Pending</p>
                <strong>{analytics.totals.pending}</strong>
                <span className="stat-subtitle">Waiting validation</span>
              </div>
              <div className="stat-card">
                <p>Cancelled</p>
                <strong>{analytics.totals.cancelled}</strong>
                <span className="stat-subtitle">Not active anymore</span>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="chart-card">
                <h3>Users Growth Over Time</h3>
                {usersGrowthChartData ? (
                  <div className="chart-canvas-wrap">
                    <Line data={usersGrowthChartData} options={commonChartOptions} />
                  </div>
                ) : (
                  <p>No user growth data.</p>
                )}
              </div>
              <div className="chart-card">
                <h3>Reservations Per Day</h3>
                {reservationsPerDayData ? (
                  <div className="chart-canvas-wrap">
                    <Bar data={reservationsPerDayData} options={commonChartOptions} />
                  </div>
                ) : (
                  <p>No reservation data.</p>
                )}
              </div>
              <div className="chart-card chart-card-pie">
                <h3>Reservations by Guests Count</h3>
                {reservationsByGuestsData ? (
                  <div className="chart-canvas-wrap pie-wrap">
                    <Pie data={reservationsByGuestsData} options={pieChartOptions} />
                  </div>
                ) : (
                  <p>No guests split data.</p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
