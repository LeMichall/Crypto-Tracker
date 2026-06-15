import { useState, useEffect } from "react";
import styles from "./Favourite.module.css";
import useFavorites from "../hooks/useFavourites";
import useLayoutContext from "../hooks/useLayoutContext";
import SearchBar from "../components/searchBar/searchBar";
import CoinCards from "../components/coinCards/coinCards";
import Loader from "../components/loader/loader";
import ErrorMessage from "../components/errorMessage/errorMessage";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../api/coins";

export default function Favourite() {
  const { favorites, removeFavorites } = useFavorites();
  const { darkMode } = useLayoutContext();
  const [searchQuery, setSearchQuery] = useState("");
  // use react-query data directly
  const [currency, setCurrency] = useState(() =>
    localStorage.getItem("currency")
  );

  // use react-query to fetch favorite coins by ids
  const {
    data: favData = [],
    isLoading: favLoading,
    isError: favIsError,
    error: favError,
    refetch: refetchFavs,
  } = useQuery({
    queryKey: ["favorites", favorites, currency],
    queryFn: () => fetchMarkets(currency, 1, Math.max(favorites.length, 1), "market_cap_desc", true, favorites.join(",")),
    enabled: favorites.length > 0,
  });

  const coins = favData || [];
  const loading = favLoading;
  const error = favIsError ? (favError?.message || "Error") : "";
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
      {error && <ErrorMessage error={error} onRetry={refetchFavs} />}
      {!loading && !error && (
        <CoinCards favCoins={filteredFavCoins} removeFav={removeFavorites} currency={currency} />
      )}
    </div>
  );
}
