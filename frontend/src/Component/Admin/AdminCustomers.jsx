import React, { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaEye, FaSearch, FaTrash, FaUsers } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminLayout from './AdminLayout';
import { deleteCustomer, getAdminCustomers, getCustomerReservations } from '../../api';
import './Admin.css';

const PAGE_SIZE = 8;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortType, setSortType] = useState('NEWEST');
  const [page, setPage] = useState(1);
  const [detailsUser, setDetailsUser] = useState(null);
  const [detailsReservations, setDetailsReservations] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAdminCustomers();
      setCustomers(result);
    } catch (err) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();
    let list = customers.filter((customer) => {
      const nameMatch = (customer.name || '').toLowerCase().includes(loweredSearch);
      const emailMatch = (customer.email || '').toLowerCase().includes(loweredSearch);
      return nameMatch || emailMatch;
    });

    if (filterType === 'WITH_RESERVATIONS') {
      list = list.filter((customer) => customer.reservationsCount > 0);
    } else if (filterType === 'ADMINS') {
      list = list.filter((customer) => customer.role === 'ADMIN');
    }

    if (sortType === 'MOST_RESERVATIONS') {
      list.sort((a, b) => b.reservationsCount - a.reservationsCount);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [customers, searchTerm, filterType, sortType]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const pagedCustomers = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterType, sortType]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleDeleteCustomer = async (customerId) => {
    const confirmed = window.confirm('Delete this customer and all their reservations?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(customerId);
      await loadCustomers();
      if (detailsUser?.id === customerId) {
        setDetailsUser(null);
        setDetailsReservations([]);
      }
    } catch (err) {
      alert(err.message || 'Unable to delete customer');
    }
  };

  const handleViewDetails = async (customer) => {
    setDetailsUser(customer);
    setDetailsLoading(true);
    try {
      const reservations = await getCustomerReservations(customer.id);
      setDetailsReservations(reservations);
    } catch (err) {
      setDetailsReservations([]);
      alert(err.message || 'Unable to load customer reservations');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleExportCustomersPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Customers Report', 14, 15);
    autoTable(doc, {
      startY: 22,
      head: [['Name', 'Email', 'Role', 'Reservations', 'Created At']],
      body: filteredCustomers.map((customer) => [
        customer.name || '-',
        customer.email || '-',
        customer.role || '-',
        customer.reservationsCount,
        new Date(customer.createdAt).toLocaleString()
      ])
    });
    doc.save('customers-report.pdf');
  };

  const usersWithReservations = customers.filter((customer) => customer.reservationsCount > 0).length;
  const adminsCount = customers.filter((customer) => customer.role === 'ADMIN').length;

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Customers</h1>
            <p className="admin-description">Manage users and see reservation activity.</p>
          </div>
          <button className="add-item-btn" onClick={handleExportCustomersPdf}>
            <FaDownload />
            Export to PDF
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <p>Total Users</p>
            <strong>{customers.length}</strong>
            <span className="stat-subtitle">Accounts in the platform</span>
          </div>
          <div className="stat-card">
            <p>With Reservations</p>
            <strong>{usersWithReservations}</strong>
            <span className="stat-subtitle">Customers who booked</span>
          </div>
          <div className="stat-card">
            <p>Admins</p>
            <strong>{adminsCount}</strong>
            <span className="stat-subtitle">Management accounts</span>
          </div>
          <div className="stat-card">
            <p>Filtered Results</p>
            <strong>{filteredCustomers.length}</strong>
            <span className="stat-subtitle">Current view count</span>
          </div>
        </div>

        <div className="admin-filters">
          <div className="category-filters">
            <button className={`category-filter ${filterType === 'ALL' ? 'active' : ''}`} onClick={() => setFilterType('ALL')}>
              All Users
            </button>
            <button
              className={`category-filter ${filterType === 'WITH_RESERVATIONS' ? 'active' : ''}`}
              onClick={() => setFilterType('WITH_RESERVATIONS')}
            >
              With Reservations
            </button>
            <button className={`category-filter ${filterType === 'ADMINS' ? 'active' : ''}`} onClick={() => setFilterType('ADMINS')}>
              Only Admins
            </button>
          </div>

          <div className="admin-controls-inline">
            <select className="search-input select-control" value={sortType} onChange={(e) => setSortType(e.target.value)}>
              <option value="NEWEST">Newest Users</option>
              <option value="MOST_RESERVATIONS">Most Reservations</option>
            </select>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? <div className="no-reservations">Loading customers...</div> : null}
        {error ? <div className="no-reservations">{error}</div> : null}

        {!loading && !error ? (
          <div className="reservations-table customers-table">
            <div className="table-header">
              <div className="table-cell">Name</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">Role</div>
              <div className="table-cell">Reservations</div>
              <div className="table-cell">Created</div>
              <div className="table-cell">Actions</div>
            </div>
            {pagedCustomers.length === 0 ? (
              <div className="no-reservations">
                <FaUsers className="no-data-icon" />
                <p>No customers found for current filters.</p>
              </div>
            ) : (
              pagedCustomers.map((customer) => (
                <div className="table-row" key={customer.id}>
                  <div className="table-cell">
                    <strong>{customer.name || 'No name'}</strong>
                  </div>
                  <div className="table-cell">{customer.email}</div>
                  <div className="table-cell">
                    <span className={`role-badge ${customer.role === 'ADMIN' ? 'admin' : 'user'}`}>{customer.role}</span>
                  </div>
                  <div className="table-cell">{customer.reservationsCount}</div>
                  <div className="table-cell">{new Date(customer.createdAt).toLocaleDateString()}</div>
                  <div className="table-cell">
                    <button className="icon-action-btn" onClick={() => handleViewDetails(customer)} title="View reservations">
                      <FaEye />
                    </button>
                    <button className="icon-action-btn danger" onClick={() => handleDeleteCustomer(customer.id)} title="Delete customer">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}

        <div className="pagination">
          <button className="category-filter" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button className="category-filter" onClick={() => setPage((v) => Math.min(totalPages, v + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>

        {detailsUser ? (
          <div className="details-panel">
            <div className="details-panel-header">
              <h3>Reservations for {detailsUser.name || detailsUser.email}</h3>
              <button className="category-filter" onClick={() => setDetailsUser(null)}>
                Close
              </button>
            </div>
            {detailsLoading ? (
              <p>Loading reservation history...</p>
            ) : detailsReservations.length === 0 ? (
              <p>No reservations found for this customer.</p>
            ) : (
              <div className="details-list">
                {detailsReservations.map((reservation) => (
                  <div key={reservation.id} className="details-item">
                    <span>{reservation.confirmationId}</span>
                    <span>{new Date(reservation.date).toLocaleDateString()}</span>
                    <span>{reservation.time}</span>
                    <span>{reservation.guests} guests</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
