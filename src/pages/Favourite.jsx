import { useState, useEffect } from "react";
import styles from "./Favourite.module.css";
import useFavorites from "../hooks/useFavourites";
import useLayoutContext from "../hooks/useLayoutContext";
import SearchBar from "../components/searchBar/searchBar";
import CoinCards from "../components/coinCards/coinCards";
import Loader from "../components/loader/loader";
import ErrorMessage from "../components/errorMessage/errorMessage";

export default function Favourite() {
  const { favorites, removeFavorites } = useFavorites();
  const { darkMode } = useLayoutContext();
  const [coins, setCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState(() =>
    localStorage.getItem("currency")
  );

  //fetching function , move to separate file?
  const fetchCoins = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&sparkline=true&ids=${favorites.join(
          ","
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch coins");
      const data = await res.json();
      setCoins(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // fetching coins on load if favorites exists
  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    fetchCoins();
  }, []);
  // Filtering coins to enable searchBar
  // Force component render on favorites change
  const filteredFavCoins = coins.filter(
    (coin) =>
      favorites.includes(coin.id) &&
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className={`${styles.favourite} ${darkMode ? styles.dark : ""}`}>
      <SearchBar
        searchQuery={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onRetry={fetchCoins} />}
      {!loading && !error && (
        <CoinCards favCoins={filteredFavCoins} removeFav={removeFavorites} currency={currency} />
      )}
    </div>
  );
}
