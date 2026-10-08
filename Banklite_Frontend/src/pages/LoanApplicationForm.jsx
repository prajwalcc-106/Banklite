import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { applyForLoan } from '../utils/api.jsx';
import styles from '../styles/LoanApplicationForm.module.css';

const LoanApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('home');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const loanPurposes = [
    { value: 'home', label: 'Home Loan' },
    { value: 'auto', label: 'Auto Loan' },
    { value: 'personal', label: 'Personal Loan' },
    { value: 'business', label: 'Business Loan' },
    { value: 'education', label: 'Education Loan' },
  ];

  const summary = useMemo(() => {
    const parsedAmount = parseFloat(amount || 0);
    const parsedIncome = parseFloat(monthlyIncome || 0);
    const ratio = parsedIncome > 0 ? ((parsedAmount / 12) / parsedIncome) * 100 : 0;
    return {
      parsedAmount,
      parsedIncome,
      ratio,
    };
  }, [amount, monthlyIncome]);

  const handleNext = () => {
    if (!amount || !monthlyIncome) {
      setError('Please fill in the loan amount and monthly income first.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const resultResponse = await applyForLoan(
      parseFloat(amount),
      purpose,
      parseFloat(monthlyIncome)
    );

    if (resultResponse.success) {
      setResult(resultResponse.data?.data || resultResponse.data || null);
      setStep(3);
    } else {
      setError(resultResponse.error || 'Failed to submit application');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1>Loan Application Form</h1>
          <p className={styles.subtitle}>
            Follow the steps below to submit your application and view the API response.
          </p>

          <div className={styles.stepper}>
            <span className={step >= 1 ? styles.activeStep : ''}>1. Details</span>
            <span className={step >= 2 ? styles.activeStep : ''}>2. Review</span>
            <span className={step >= 3 ? styles.activeStep : ''}>3. Result</span>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {step === 1 && (
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label htmlFor="amount">Loan Amount *</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  step="100"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="monthlyIncome">Monthly Income *</label>
                <input
                  id="monthlyIncome"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="Enter your monthly income"
                  step="100"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="purpose">Loan Purpose *</label>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  {loanPurposes.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" className={styles.submitBtn} onClick={handleNext}>
                  Continue
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => navigate('/customer-dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className={styles.form}>
              <div className={styles.summaryCard}>
                <h3>Review your application</h3>
                <p><strong>Amount:</strong> ${summary.parsedAmount.toLocaleString()}</p>
                <p><strong>Monthly Income:</strong> ${summary.parsedIncome.toLocaleString()}</p>
                <p><strong>Purpose:</strong> {loanPurposes.find((p) => p.value === purpose)?.label}</p>
                <p><strong>Estimated Debt-to-Income:</strong> {summary.ratio.toFixed(1)}%</p>
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setStep(1)} disabled={loading}>
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className={styles.form}>
              <div className={styles.success}>
                Application submitted successfully. The API returned the following response:
              </div>
              <pre className={styles.responseBox}>{JSON.stringify(result, null, 2)}</pre>

              <div className={styles.buttonGroup}>
                <button type="button" className={styles.submitBtn} onClick={() => navigate('/customer-dashboard')}>
                  Go to Dashboard
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setStep(1)}>
                  Apply Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoanApplicationForm;
