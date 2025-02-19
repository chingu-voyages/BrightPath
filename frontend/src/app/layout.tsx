import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans, Josefin_Sans } from "next/font/google";
import { Layout } from "antd";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "@/components/Providers";
import AppFooter from "@/components/Footer/AppFooter";
import AppHeader from "@/components/Header/AppHeader";

import "./globals.css";

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
    subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
    variable: "--font-josefin-sans",
    subsets: ["latin"],
});

const geistMono = {
    variable: "--font-geist-mono",
    subsets: ["latin"],
};

export const metadata: Metadata = {
    title: "BrightPath",
    description:
        "BrightPath is a custom platform for online courses covering niche tech topics not currently addressed elsewhere.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en">
            <body>
                <Providers>
                    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                        <SessionProvider basePath={"/auth"} session={session}>
                            <Layout
                                className={`${notoSans.variable} ${josefinSans.variable} ${geistMono.variable} antialiased font-sans bg-white h-screen`}
                            >
                                <AppHeader />
                                {/* main contents */}
                                <div className="main-section bg-brightpath text-brightpath-slate">
                                    <main className="lg:container lg:max-w-screen-lg px-4 sm:mx-6 lg:mx-auto lg:px-4">
                                        {children}
                                    </main>
                                </div>

                                <AppFooter />
                            </Layout>
                        </SessionProvider>
                    </AppRouterCacheProvider>
                </Providers>
            </body>
        </html>
    );
}
