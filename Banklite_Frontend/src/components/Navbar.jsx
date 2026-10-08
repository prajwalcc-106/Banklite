import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserName } from '../utils/auth.jsx';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const userName = getUserName();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h1>BankLite</h1>
        </div>
        <div className={styles.user}>
          <span>{userName}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
