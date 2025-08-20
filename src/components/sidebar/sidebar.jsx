import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";

const Sidebar = ({ darkMode }) => {
  return (
    <div className={`${styles.sidebar} ${darkMode ? "dark" : ""}`}>
      <div className={styles.logo}>Crypto App</div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? "active" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/favourite"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? "active" : ""}`
          }
        >
          Favourite
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
