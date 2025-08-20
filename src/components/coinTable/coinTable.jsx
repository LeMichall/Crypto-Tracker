import styles from "./coinTable.module.css";
import { formatCurrency } from "../../utils/formatter";
import useLayoutContext from "../../hooks/useLayoutContext";
import useFavorites from "../../hooks/useFavourites";

export default function CoinTable({
  coins,
  onSort,
  sortConfig,
  onSelectCoin,
  page,
  setPage,
  currency,
}) {
  const { darkMode } = useLayoutContext();
  const { addFavorites, removeFavorites, isFavorites } = useFavorites();
  return (
    <div className={`${styles.tableContainer} ${darkMode ? styles.dark : ""}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => onSort("name")}>
              Coin
              {sortConfig.key === "name" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => onSort("current_price")}>
              Price (USD)
              {sortConfig.key === "current_price" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => onSort("price_change_percentage_24h")}>
              24h Change
              {sortConfig.key === "price_change_percentage_24h" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => onSort("market_cap")}>
              Market Cap
              {sortConfig.key === "market_cap" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td className={styles.cryptoIcon}>
                <button
                  className={styles.favButton}
                  onClick={() =>
                    isFavorites(coin.id)
                      ? removeFavorites(coin.id)
                      : addFavorites(coin.id)
                  }
                >
                  {isFavorites(coin.id) ? "★" : "☆"}
                </button>
                <span onClick={() => onSelectCoin(coin)}>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    width="25"
                    className={styles.coinImage}
                  />
                  {coin.name}
                </span>
              </td>
              <td>{formatCurrency(coin.current_price, currency)}</td>
              <td
                className={
                  coin.price_change_percentage_24h >= 0
                    ? styles.green
                    : styles.red
                }
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>{formatCurrency(coin.market_cap, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          {"<"}
        </button>
        <span className={styles.paginationPage}>{page}</span>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
