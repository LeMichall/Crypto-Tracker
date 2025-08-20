import styles from "./errorMessage.module.css";

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className={styles.errorContainer}>
      <p>Error: {error}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
