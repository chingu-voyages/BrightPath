import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "antd";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/Providers";
import AppFooter from "@/components/Footer/AppFooter";
import AppHeader from "@/components/Header/AppHeader";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
                    <Layout
                        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-start items-start text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium font-mono min-h-screen`}
                    >
                        <AppHeader />
                        {/* main contents */}
                        <main className="lg:container lg:mx-auto mt-32">
                            <SessionProvider
                                basePath={"/auth"}
                                session={session}
                            >
                                {children}
                            </SessionProvider>
                        </main>

                        <AppFooter />
                    </Layout>
                </Providers>
            </body>
        </html>
    );
}
