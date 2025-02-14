import Link from "next/link";
import React from "react";
import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import UserMenu from "../UserMenu";
import { auth } from "@/auth";

export default async function AppHeader() {
    const session = await auth();

    return (
        <Header className="flex justify-between text-lg md:text-2xl items-center w-full p-6 md:p-12 lg:px-28 xl:px-48 2xl:px-72 shadow-sm bg-white dark:bg-slate-800 fixed top-0 left-0 z-50">
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
    );
}
