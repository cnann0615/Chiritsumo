/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // 画像の外部ドメインを許可する設定
  images: {
    domains: ["lh3.googleusercontent.com"], // Googleのプロフィール画像ホストを許可
  },
  // その他のNext.jsの設定（例: React Strict Modeの有効化）
  reactStrictMode: true,
};

export default config;
