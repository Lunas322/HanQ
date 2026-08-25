import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  htmlLimitedBots:
    /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://hanq-e757f.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
