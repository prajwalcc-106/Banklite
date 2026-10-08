export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getRole = () => {
  return localStorage.getItem('role');
};

export const getUserName = () => {
  return localStorage.getItem('name');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
};

export const isCustomer = () => {
  return getRole() === 'customer';
};

export const isCreditOfficer = () => {
  return getRole() === 'credit_officer';
};
