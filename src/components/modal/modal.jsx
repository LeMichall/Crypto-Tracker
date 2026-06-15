import React, { useEffect, useState } from "react";
import styles from "./modal.module.css";
import useLayoutContext from "../../hooks/useLayoutContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetails } from "../../api/coins";

export default function Modal({ coin, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode } = useLayoutContext();

  const handleCloseModal = () => {
    setIsExpanded(false);
    console.log(detailsData);
    onClose();
  };

  const getTruncatedText = (text, limit = 300) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const { data: detailsData, refetch: refetchDetails } = useQuery({
    queryKey: ["coin", coin?.id],
    queryFn: () => fetchCoinDetails(coin.id),
    enabled: !!coin,
  });

  if (!coin || !detailsData) return null;

  const description = detailsData.description?.en || "No description available.";
  const homepageLinks = detailsData.links?.homepage?.filter((link) => link);
  const sentimentUp = detailsData.sentiment_votes_up_percentage;
  const sentimentDown = detailsData.sentiment_votes_down_percentage;

  return (
    <div
      className={`${styles.modalOverlay} ${darkMode ? styles.dark : ""}`}
      onClick={handleCloseModal}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
        <img src={coin.image} alt={coin.name} width={50} />

        {homepageLinks?.length > 0 && (
          <div className={styles.modalSection}>
            <h3>Official Links</h3>
            <div className={styles.modalLinks}>
              {homepageLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className={styles.modalSection}>
          <h3>Community Sentiment</h3>
          <div className={styles.modalVotes}>
            <span>👍 {sentimentUp?.toFixed(1) || 0}%</span>
            <span>👎 {sentimentDown?.toFixed(1) || 0}%</span>
          </div>
        </div>
        <h3>Description</h3>
        <p>
          {isExpanded ? description : getTruncatedText(description)}

          {description.length > 300 && (
            <span
              className={styles.readToggle}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  );
}
