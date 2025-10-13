import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Allow example.com for test environments
      ...(process.env.NODE_ENV === "test"
        ? [
            {
              protocol: "https" as const,
              hostname: "example.com",
            },
          ]
        : []),
    ],
  },
  // Allow 127.0.0.1 for Mailchimp OAuth testing (required for dev environment)
  allowedDevOrigins: [
    "127.0.0.1:3000",
    "https://127.0.0.1:3000",
    "localhost:3000",
  ],
};

export default nextConfig;
