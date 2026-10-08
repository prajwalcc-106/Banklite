import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getPendingLoans, submitLoanDecision } from '../utils/api.jsx';
import styles from '../styles/UnderwritingConsole.module.css';

const UnderwritingConsole = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanDetails = async () => {
      const result = await getPendingLoans();
      if (result.success) {
        const loans = result.data.data?.pending_applications || [];

const foundLoan = loans.find(
  (l) => l.id === parseInt(loanId)
);
        if (foundLoan) {
          setLoan(foundLoan);
        } else {
          setError('Loan application not found');
        }
      } else {
        setError('Failed to fetch loan details');
      }
      setLoading(false);
    };

    fetchLoanDetails();
  }, [loanId]);

  const getRiskAssessment = (creditScore) => {
    if (creditScore >= 700) {
      return { category: 'Safe', color: styles.safe, recommendation: 'Low Risk - Recommended for Approval' };
    } else if (creditScore >= 550) {
      return { category: 'Medium', color: styles.medium, recommendation: 'Medium Risk - Review Carefully' };
    } else {
      return { category: 'High Risk', color: styles.highRisk, recommendation: 'High Risk - Caution Required' };
    }
  };

  const handleApprove = async () => {
    if (!comments.trim()) {
      setError('Please add comments before approving');
      return;
    }
    await submitDecision('approved');
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      setError('Please add comments before rejecting');
      return;
    }
    await submitDecision('rejected');
  };

  const submitDecision = async (action) => {
    setSubmitting(true);
    setError('');

    const result = await submitLoanDecision(loan.id, action, comments);

    if (result.success) {
      setTimeout(() => {
        navigate('/officer-dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Failed to submit decision');
    }

    setSubmitting(false);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  if (!loan) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
          <button onClick={() => navigate('/officer-dashboard')} className={styles.backBtn}>
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const riskAssessment = getRiskAssessment(loan.credit_score);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/officer-dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>Loan Underwriting Console</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.content}>
          {/* Application Details Section */}
          <div className={styles.section}>
            <h2>Application Details</h2>
            <div className={styles.grid}>
              <div className={styles.detailItem}>
                <label>Application ID</label>
                <span className={styles.value}>#{loan.id}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Customer Name</label>
                <span className={styles.value}>{loan.applicant_name}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Loan Amount</label>
                <span className={styles.value}>${loan.amount.toLocaleString()}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Monthly Income</label>
                <span className={styles.value}>${loan.monthly_income.toLocaleString()}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Debt-to-Income Ratio</label>
                <span className={styles.value}>
                  {((loan.amount / 12 / loan.monthly_income) * 100).toFixed(1)}%
                </span>
              </div>
              <div className={styles.detailItem}>
                <label>Loan Purpose</label>
                <span className={styles.value}>
                  {loan.purpose.charAt(0).toUpperCase() + loan.purpose.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Assessment Section */}
          <div className={styles.section}>
            <h2>Risk Assessment</h2>
            <div className={`${styles.riskCard} ${riskAssessment.color}`}>
              <div className={styles.riskScore}>
                <div className={styles.scoreCircle}>
                  <span className={styles.scoreText}>{loan.credit_score}</span>
                  <span className={styles.scoreLabel}>Credit Score</span>
                </div>
              </div>
              <div className={styles.riskInfo}>
                <h3>Risk Category: {riskAssessment.category}</h3>
                <p>{riskAssessment.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Decision Section */}
          <div className={styles.section}>
            <h2>Underwriting Decision</h2>
            <div className={styles.commentBox}>
              <label htmlFor="comments">Officer Comments & Analysis *</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your underwriting analysis, risk factors, and decision reasoning..."
                rows="6"
                disabled={submitting}
              />
              <span className={styles.charCount}>
                {comments.length} characters
              </span>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={`${styles.btn} ${styles.approveBtn}`}
                onClick={handleApprove}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : '✓ Approve'}
              </button>
              <button
                className={`${styles.btn} ${styles.rejectBtn}`}
                onClick={handleReject}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : '✗ Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnderwritingConsole;
