import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/Navbar.jsx';
import { getPendingLoans } from '../utils/api.jsx';
import styles from '../styles/OfficerDashboard.module.css';

const COLORS = {
  safe: '#10b981',
  medium: '#f59e0b',
  highRisk: '#ef4444',
};

const OfficerDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingLoans = async () => {
      setLoading(true);
      setError('');

      const result = await getPendingLoans();
      const responseData = result?.data?.data || result?.data || {};

      if (result.success) {
        setLoans(responseData.pending_applications || []);
      } else {
        setError(result.error || responseData.error || 'Failed to fetch pending loans');
      }
      setLoading(false);
    };

    fetchPendingLoans();
  }, []);

  const categorizeByRisk = (loans) => {
    const safe = loans.filter((l) => l.credit_score >= 700).length;
    const medium = loans.filter((l) => l.credit_score >= 550 && l.credit_score < 700).length;
    const highRisk = loans.filter((l) => l.credit_score < 550).length;

    return [
      { name: 'Safe (700+)', value: safe, color: COLORS.safe },
      { name: 'Medium (550-699)', value: medium, color: COLORS.medium },
      { name: 'High Risk (<550)', value: highRisk, color: COLORS.highRisk },
    ];
  };

  const getRiskCategory = (creditScore) => {
    if (creditScore >= 700) return 'Safe';
    if (creditScore >= 550) return 'Medium';
    return 'High Risk';
  };

  const getRiskColor = (creditScore) => {
    if (creditScore >= 700) return styles.safe;
    if (creditScore >= 550) return styles.medium;
    return styles.highRisk;
  };

  const handleReview = (loanId) => {
    navigate(`/underwrite/${loanId}`);
  };

  const chartData = categorizeByRisk(loans);
  const totalLoans = loans.length;

  const formatCurrency = (value) => {
    const numericValue = Number(value || 0);
    return Number.isFinite(numericValue) ? `$${numericValue.toLocaleString()}` : '$0';
  };

  const getCustomerName = (loan) => {
    return loan.applicant_name || loan.customer_name || loan.full_name || loan.customer || 'Unknown Customer';
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Officer Dashboard</h1>

        {loading && <div className={styles.loading}>Loading...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <>
            <div className={styles.statsSection}>
              <div className={styles.statCard}>
                <h3>Pending Applications</h3>
                <p className={styles.statNumber}>{totalLoans}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Loan Amount</h3>
                <p className={styles.statNumber}>
                  {formatCurrency(
                    loans.reduce((sum, l) => sum + Number(l.amount || 0), 0)
                  )}
                </p>
              </div>
              <div className={styles.statCard}>
                <h3>Avg Credit Score</h3>
                <p className={styles.statNumber}>
                  {totalLoans > 0
                    ? (
                      loans.reduce((sum, l) => sum + Number(l.credit_score || 0), 0) /
                      totalLoans
                    ).toFixed(0)
                    : '0'}
                </p>
              </div>
            </div>

            {totalLoans > 0 && (
              <div className={styles.chartSection}>
                <h2>Risk Distribution</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className={styles.loansSection}>
              <h2>Pending Loan Applications</h2>

              {totalLoans === 0 ? (
                <div className={styles.noLoans}>
                  <p>No pending loan applications</p>
                </div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>App ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Loan Amount</th>
                        <th>Monthly Income</th>
                        <th>Credit Score</th>
                        <th>Risk Category</th>
                        <th>Purpose</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.map((loan) => (
                        <tr key={loan.id}>
                          <td>#{loan.id}</td>
                          <td>{loan.date || '—'}</td>
                          <td>{getCustomerName(loan)}</td>
                          <td>{formatCurrency(loan.amount)}</td>
                          <td>{formatCurrency(loan.monthly_income)}</td>
                          <td>{loan.credit_score ?? '—'}</td>
                          <td>
                            <span className={`${styles.riskBadge} ${getRiskColor(loan.credit_score)}`}>
                              {getRiskCategory(loan.credit_score)}
                            </span>
                          </td>
                          <td>{loan.purpose || '—'}</td>
                          <td>
                            <button
                              className={styles.reviewBtn}
                              onClick={() => handleReview(loan.id)}
                            >
                              Review Underwriting
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OfficerDashboard;
