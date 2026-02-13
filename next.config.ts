import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ローカル画像の最適化を有効化
    unoptimized: false,
  },
};

export default nextConfig;
