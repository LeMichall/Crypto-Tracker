// API helpers for CoinGecko
const BASE_URL = "https://api.coingecko.com/api/v3";

// Fetch markets (coins) list from CoinGecko
export async function fetchMarkets(
  vs_currency = "usd",
  page = 1,
  per_page = 20,
  order = "market_cap_desc",
  sparkline = true,
  ids = null
) {
  const paramsObj = {
    vs_currency,
    order,
    per_page: String(per_page),
    page: String(page),
    sparkline: String(sparkline),
  };
  if (ids) paramsObj.ids = ids;
  const params = new URLSearchParams(paramsObj);

  const url = `${BASE_URL}/coins/markets?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CoinGecko markets fetch failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data;
}

export async function fetchCoinDetails(id) {
  if (!id) throw new Error("Missing coin id");
  const url = `${BASE_URL}/coins/${encodeURIComponent(id)}?localization=false`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CoinGecko coin details fetch failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data;
}
