import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/sidebar";
import Footer from "../components/footer/footer";
import styles from "./MainLayout.module.css";
import useDarkMode from "../hooks/useDarkMode";

export default function MainLayout() {
  const [darkMode, toggleDarkMode] = useDarkMode(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  return (
    <div className={`${styles.layout} ${darkMode ? styles.dark : ""}`}>
      <header className={`${styles.header} ${darkMode ? styles.dark : ""}`}>
        <Sidebar darkMode={darkMode} />
        <button className={styles.toggleBtn} onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <main className={styles.content}>
        <Outlet context={{ darkMode }} />
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}
