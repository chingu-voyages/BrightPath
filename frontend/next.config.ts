import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            "localhost",
            "lh3.googleusercontent.com",
            ...(process.env.NEXT_PUBLIC_BACKEND_API_URL
                ? [new URL(process.env.NEXT_PUBLIC_BACKEND_API_URL).hostname]
                : []),
        ],
    },
};

export default nextConfig;
