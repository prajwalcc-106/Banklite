import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import LoanApplicationForm from './pages/LoanApplicationForm';
import OfficerDashboard from './pages/OfficerDashboard';
import UnderwritingConsole from './pages/UnderwritingConsole';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Customer Routes */}
        <Route
          path="/customer-dashboard"
          element={
            <PrivateRoute requiredRole="customer">
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/apply-loan"
          element={
            <PrivateRoute requiredRole="customer">
              <LoanApplicationForm />
            </PrivateRoute>
          }
        />

        {/* Officer Routes */}
        <Route
          path="/officer-dashboard"
          element={
            <PrivateRoute requiredRole="credit_officer">
              <OfficerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/underwrite/:loanId"
          element={
            <PrivateRoute requiredRole="credit_officer">
              <UnderwritingConsole />
            </PrivateRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
