import styles from "./searchBar.module.css";

export default function SearchBar({ searchQuery, onChange }) {
  return (
    <input
      type="text"
      value={searchQuery}
      placeholder="Search for coin"
      onChange={onChange}
      className={styles.searchInput}
    />
  );
}
