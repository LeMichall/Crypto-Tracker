import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // keep data fresh for 10 minutes to avoid frequent refetches
      staleTime: 1000 * 60 * 10,
      // keep cache for 15 minutes
      cacheTime: 1000 * 60 * 15,
      // don't refetch on window focus or mount by default
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // retry once with exponential backoff to avoid hammering the API
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Crypto-Tracker">
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
