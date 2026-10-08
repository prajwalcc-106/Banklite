const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const getToken = () => localStorage.getItem('token');

// Auth API Calls
export const login = async (email, password) => {
  try {
    console.log("Sending request...");

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    if (response.ok) {
      localStorage.setItem("token", data.data?.token || data.token);
      localStorage.setItem("role", data.data?.role || data.role);
      localStorage.setItem("name", data.data?.full_name || data.full_name);
    }

    return { success: response.ok, data };
  } catch (err) {
    console.error("Fetch Error:", err);
    return { success: false, error: err.message };
  }
};
// Loan Applications API Calls
export const applyForLoan = async (amount, purpose, monthly_income) => {
  try {
    console.log("TOKEN:", getToken());

    const response = await fetch(`${API_BASE_URL}/loans/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getToken(),
      },
      body: JSON.stringify({
        amount,
        purpose,
        monthly_income,
      }),
    });

    console.log("STATUS:", response.status);

    const data = await response.json();
    console.log("RESPONSE:", data);

    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return { success: false, error: error.message };
  }
};

export const getMyApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/my-applications`, {
      method: 'GET',
      headers: {
        'Authorization': getToken(),
      },
    });
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Officer API Calls
export const getPendingLoans = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/pending`, {
      method: 'GET',
      headers: {
        'Authorization': getToken(),
      },
    });
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const submitLoanDecision = async (loanId, action, comments) => {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/action`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken(),
      },
      body: JSON.stringify({ action, comments }),
    });
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
