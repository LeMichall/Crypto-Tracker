import { useState, useEffect } from "react";
const FAVORITES_KEY = "favorites";

export default function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorites = (id) => {
    if (!id) return;
    if (!favorites.includes(id)) {
      setFavorites([...favorites, id]);
    }
  };
  const removeFavorites = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    }
  };
  const isFavorites = (id) => favorites.includes(id);
  // destructure as object { ... , ...}
  return { favorites, addFavorites, removeFavorites, isFavorites };
}
