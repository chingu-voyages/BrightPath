import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontSize: {
                "headline-4xl": [
                    "72px",
                    { lineHeight: "80px", letterSpacing: "0%" },
                ],
                "headline-3xl": [
                    "64px",
                    { lineHeight: "72px", letterSpacing: "0%" },
                ],
                "headline-2xl": [
                    "56px",
                    { lineHeight: "64px", letterSpacing: "0%" },
                ],
                "headline-xl": [
                    "48px",
                    { lineHeight: "56px", letterSpacing: "0%" },
                ],
                "headline-l": [
                    "40px",
                    { lineHeight: "48px", letterSpacing: "0%" },
                ],
                "headline-m": [
                    "32px",
                    { lineHeight: "40px", letterSpacing: "0%" },
                ],
                "headline-s": [
                    "24px",
                    { lineHeight: "32px", letterSpacing: "0%" },
                ],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brightpath: {
                    slate: "#333333",
                    blue: "#319CCA",
                    "blue-light": "#3291ff",
                    "blue-extra-light": "#DFE9F7",
                    "blue-dark": "#2C8DB7",
                    "blue-xdark": "#0B516F",
                    gold: "#EEC857",
                    "gold-dark": "#94730F",
                },
            },
            backgroundImage: {
                brightpath: "linear-gradient(0deg, #FFFFFF 91%, #F1F6FC 100%)",
                slate: "linear-gradient(340.02deg, rgba(255, 255, 255, 0) 79.86%, rgba(255, 255, 255, 0.0914255) 85.06%, rgba(255, 255, 255, 0.2) 98.89%), linear-gradient(270deg, #121212 5.41%, #44444C 33.78%, #4E4E55 60%, #333339 100%)",
                "subtle-blue":
                    "linear-gradient(0deg, rgba(49, 158, 205, 0.75), rgba(49, 158, 205, 0.75)), linear-gradient(185.57deg, rgba(0, 0, 0, 0) 39.76%, rgba(0, 0, 0, 0.2) 86.56%), linear-gradient(272.49deg, #1497CF 20.1%, #39B5DF 58.38%, #319ECD 93.06%) ",
                "pronounced-blue":
                    "linear-gradient(42.11deg, rgba(0, 0, 0, 0) 68.76%, rgba(0, 0, 0, 0.1) 96.17%), linear-gradient(185.57deg, rgba(0, 0, 0, 0) 39.76%, rgba(0, 0, 0, 0.2) 86.56%), linear-gradient(272.49deg, #1497CF 20.1%, #39B5DF 58.38%, #319ECD 93.06%)",
                gold: "linear-gradient(90deg, #EEC857 0%, #f5a623 100%)",
            },
            fontFamily: {
                sans: ["var(--font-noto-sans)", "Noto Sans", "sans-serif"],
                brand: ["var(--font-josefin-sans)"],
                mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
} satisfies Config;
