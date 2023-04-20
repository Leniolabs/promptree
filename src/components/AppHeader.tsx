import { APP_DESCRIPTION, APP_NAME } from "@/settings";
import Head from "next/head";

export function AppHeader() {
  return (
    <Head>
      <title>{APP_NAME}</title>
      <meta name="description" content={APP_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/images/favicon.ico" />
    </Head>
  );
}
