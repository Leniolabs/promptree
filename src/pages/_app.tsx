import { Store } from "@/query";
import "@/styles/globals.css";
import "highlight.js/styles/codepen-embed.css";
import "@/styles/hljs.css";
import "@/styles/scrollbar.scss";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
