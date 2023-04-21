import "@/styles/globals.css";
import "highlight.js/styles/codepen-embed.css";
import "@/styles/hljs.css";
import "@/styles/scrollbar.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { StoreProvider } from "@/store";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
