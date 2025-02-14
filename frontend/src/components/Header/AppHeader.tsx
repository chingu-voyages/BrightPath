'use client'
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import UserMenu from "../UserMenu";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const scrollHandler = () => {
    const header = document.querySelector(".ant-layout-header");
    const logo = document.querySelector(".ant-layout-header .logo");
    if (header && window.location.pathname === "/") {
        if (window.scrollY > 10) {
            header.classList.add("bg-white");
            header.classList.remove("bg-transparent");
            logo?.classList.remove("invisible");
        } else {
            header.classList.remove("bg-white");
            header.classList.add("bg-transparent");
            logo?.classList.add("invisible");
        }
    }
}

export default function AppHeader() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isHomepage, setIsHomepage] = useState(true);

    useEffect(() => {
        setIsHomepage(pathname === "/");

        if (isHomepage) {
            window.addEventListener("scroll", scrollHandler);
        } else {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [pathname]);


    const menuItems = useMemo(() => {
        const items = [
            {
                key: "home",
                label: (<Link href="/">Home</Link>),
            },
            {
                key: "courses",
                label: (<Link href="/courses">Courses</Link>),
            },
            {
                key: "team",
                label: (<Link href="/our-team">Team</Link>),
            },
        ];

        if (session) {
            items.push({
                key: "user",
                label: <UserMenu />,
            });
        } else {
            items.push({
                key: "signin",
                label: <Link href="/auth/signin">Sign In</Link>,
            });
        }

        return items;
    }, [session]);

    return (
        <>
            <Header className={`w-full fixed top-0 inset-x-0 z-50 h-fit py-2 ${isHomepage ? "bg-transparent" : "bg-white shadow-sm"}`}>
                <div className="lg:container mx-auto flex items-center justify-between">
                    <Link href={"/"} className={`logo ${isHomepage ? "invisible" : ""}`}>
                        <Image
                            src="/Logo_DarkM.png"
                            alt="Logo"
                            width={225}
                            height={75}
                        />
                    </Link>

                    <Menu
                        mode="horizontal"
                        items={menuItems}
                        className={`bg-transparent flex items-center justify-end border-none text-xl ${isHomepage ? "text-white" : "text-black"}`}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </div>
            </Header >
        </>
    );
}
