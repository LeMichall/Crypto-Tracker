import { formatCurrency } from "../../utils/formatter";
import useLayoutContext from "../../hooks/useLayoutContext";
import styles from "./coinCards.module.css";
import SparklineChart from "../sparklineChart/sparklineChart";

export default function CoinCards({ favCoins, removeFav, currency }) {
  const { darkMode } = useLayoutContext();
  return (
    <div className={styles.cardContainer}>
      {favCoins.map((coin) => (
        <div
          className={`${styles.card} ${darkMode ? styles.dark : ""}`}
          key={coin.id}
        >
          {console.log(coin.sparkline_in_7d)}
          <img src={coin.image} alt={coin.name} />
          <h3 className={styles.coinName}>{coin.name}</h3>
          <p className={styles.coinValue}>
            {formatCurrency(coin.current_price, currency)}
          </p>
          <SparklineChart data={coin.sparkline_in_7d.price} />
          <button onClick={() => removeFav(coin.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
