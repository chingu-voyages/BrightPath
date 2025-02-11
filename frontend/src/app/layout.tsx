import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Providers from "@/components/Providers";
import UserAvatar from "@/components/UserAvatar";
import UserMenu from "@/components/UserMenu";
import AppFooter from "@/components/Footer/AppFooter";

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
                        className={`${geistSans.variable} ${geistMono.variable} antialiased p-4 flex flex-col justify-start items-start text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-900 font-medium font-mono`}
                    >
                        <Header className="flex justify-between text-lg md:text-2xl items-center w-full p-6 md:p-12 lg:px-28 xl:px-48 2xl:px-72  rounded-md md:rounded-xl shadow-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 mb-6">
                            <Link href={"/"} className="font-semibold ">
                                <Image
                                    src="/Logo_DarkM.png"
                                    alt="Logo"
                                    width={225}
                                    height={75}
                                />
                            </Link>
                            <nav className="flex justify-center items-center gap-6 ">
                                <Link
                                    href={"/"}
                                    className="text-slate-700 dark:text-slate-100 hover:opacity-75 hover:underline delay-500 hidden md:block"
                                >
                                    Home
                                </Link>

                                <Link
                                    href={"/courses"}
                                    className="text-slate-700 dark:text-slate-100 hover:opacity-75 hover:underline delay-500"
                                >
                                    Courses
                                </Link>

                                <Link
                                    href="/our-team"
                                    className="text-slate-700 dark:text-slate-100 hover:opacity-75 hover:underline delay-500"
                                >
                                    Team
                                </Link>

                                {session?.user ? (
                                    <div className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500">
                                        <UserMenu />
                                    </div>
                                ) : (
                                    <Link
                                        href={"/auth/signin"}
                                        className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
                                    >
                                        <UserAvatar />
                                    </Link>
                                )}
                            </nav>
                        </Header>
                        {/* main contents */}
                        <main className="lg:container lg:mx-auto">
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
