import React from "react";
import styles from "./selector.module.css";
import useLayoutContext from "../../hooks/useLayoutContext";

const currencies = [
  { code: "usd", label: "USD", flag: "🇺🇸" },
  { code: "eur", label: "EUR", flag: "🇪🇺" },
  { code: "gbp", label: "GBP", flag: "🇬🇧" },
  { code: "jpy", label: "JPY", flag: "🇯🇵" },
  { code: "pln", label: "PLN", flag: "🇵🇱" },
];

export default function CurrencySelector({ value, onChange }) {
  const { darkMode } = useLayoutContext();
  return (
    <div className={styles.selectWrapper}>
      <select
        className={`${styles.select} ${darkMode ? styles.dark : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.flag} {curr.label}
          </option>
        ))}
      </select>
    </div>
  );
}
