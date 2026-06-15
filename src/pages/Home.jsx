import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Modal from "../components/modal/modal";
import useLayoutContext from "../hooks/useLayoutContext";
import CurrencySelector from "../components/selector/selector";
import Loader from "../components/loader/loader";
import SearchBar from "../components/searchBar/searchBar";
import ErrorMessage from "../components/errorMessage/errorMessage";
import CoinTable from "../components/coinTable/coinTable";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../api/coins";

export default function Home() {
  // Initial state straight from localStorage with fallback "usd"
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "usd";
  });

  const { darkMode } = useLayoutContext();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // use data directly from react-query
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // use react-query for markets
  const {
    data: queryData = [],
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["markets", currency, page],
    queryFn: () => fetchMarkets(currency, page),
    keepPreviousData: true,
    refetchInterval: 600000,
  });

  const coins = queryData || [];
  const loading = isLoading;
  const error = isError ? (queryError?.message || "Error") : null;
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
  // react-query will refetch automatically when `currency` or `page` in the queryKey change

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
      {error && <ErrorMessage error={error} onRetry={refetch} />}
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
