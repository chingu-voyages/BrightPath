import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans, Josefin_Sans } from "next/font/google";
import { Layout } from "antd";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
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

const geistMono = ({
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
                    <SessionProvider
                        basePath={"/auth"}
                        session={session}
                    >
                        <Layout
                            className={`${notoSans.variable} ${josefinSans.variable} ${geistMono.variable} antialiased font-sans bg-white h-screen`}
                        >
                            <AppHeader />
                            {/* main contents */}
                            <main className="lg:container mx-auto">
                                {children}
                            </main>

                            <AppFooter />
                        </Layout>
                    </SessionProvider>
                </Providers>
            </body>
        </html>
    );
}
