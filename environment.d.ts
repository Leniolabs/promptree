namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";

    readonly DATABASE_URL: string;

    readonly GOOGLE_ID: string;
    readonly GOOGLE_SECRET: string;

    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;
  }
}
