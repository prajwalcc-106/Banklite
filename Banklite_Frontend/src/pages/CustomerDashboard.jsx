import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getMyApplications } from '../utils/api.jsx';
import styles from '../styles/CustomerDashboard.module.css';

const CustomerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');

      const result = await getMyApplications();
      const responseData = result?.data?.data || result?.data || {};

      if (result.success) {
        setApplications(responseData.applications || []);
      } else {
        setError(result.error || responseData.error || 'Failed to fetch applications');
      }
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const handleApplyForNewLoan = () => {
    navigate('/apply-loan');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return styles.approved;
      case 'rejected':
        return styles.rejected;
      case 'pending':
        return styles.pending;
      default:
        return '';
    }
  };

  const formatCurrency = (value) => {
    const numericValue = Number(value || 0);
    return Number.isFinite(numericValue) ? `$${numericValue.toLocaleString()}` : '$0';
  };

  const formatDate = (value) => {
    if (!value) {
      return '—';
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? '—' : parsedDate.toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Loan Applications</h1>
          <button
            className={styles.applyBtn}
            onClick={handleApplyForNewLoan}
          >
            Apply for New Loan
          </button>
        </div>

        {loading && <div className={styles.loading}>Loading...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && applications.length === 0 && (
          <div className={styles.noApplications}>
            <p>You haven't submitted any loan applications yet.</p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Monthly Income</th>
                  <th>Credit Score</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>{formatCurrency(app.amount)}</td>
                    <td>{app.purpose || '—'}</td>
                    <td>{formatCurrency(app.monthly_income)}</td>
                    <td>{app.credit_score ?? '—'}</td>
                    <td>
                      <span className={`${styles.status} ${getStatusColor(app.status)}`}>
                        {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td>{formatDate(app.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerDashboard;
