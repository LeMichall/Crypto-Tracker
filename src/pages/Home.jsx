import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Modal from "../components/modal/modal";
import useLayoutContext from "../hooks/useLayoutContext";
import CurrencySelector from "../components/selector/selector";
import Loader from "../components/loader/loader";
import SearchBar from "../components/searchBar/searchBar";
import ErrorMessage from "../components/errorMessage/errorMessage";
import CoinTable from "../components/coinTable/coinTable";

export default function Home() {
  // Initial state straight from localStorage with fallback "usd"
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "usd";
  });

  const { darkMode } = useLayoutContext();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetching function, move to separate file?
  const fetchCoins = async () => {
    setLoading(true);
    console.log("fetched");
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=${page}&sparkline=true`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setCoins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  //Sorting coins
  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
  });
// fetch on load, refresh rate 10 min or on currency/page change
  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 600000);
    return () => clearInterval(interval);
  }, [currency, page]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "asc",
        };
      }
    });
  };
  const filteredCoins = sortedCoins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.home} ${darkMode ? styles.dark : ""}`}>
      <CurrencySelector value={currency} onChange={setCurrency} />
      <SearchBar
        searchQuery={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onRetry={fetchCoins} />}
      {!loading && !error && (
        <CoinTable
          coins={filteredCoins}
          onSort={handleSort}
          sortConfig={sortConfig}
          onSelectCoin={setSelectedCoin}
          page={page}
          setPage={setPage}
          currency={currency}
          
        />
      )}

      <Modal
        coin={selectedCoin}
        onClose={() => setSelectedCoin(null)}
        currency={currency}
      />
    </div>
  );
}
