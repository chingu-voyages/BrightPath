"use client";
import Image from "next/image";
import Avatar from "antd/es/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";

export default function UserAvatar() {
    const { data: session } = useSession();
    const name = session?.user?.name;

    if (!session?.user?.image) return <UserOutlined />;

    return (
        <Avatar
            size={52}
            icon={
                <Image
                    src={session?.user?.image}
                    alt={name ? `${name}'s avatar` : "User avatar"}
                    width={52}
                    height={52}
                    unoptimized
                    className="object-cover cursor-pointer bg-blue-500 hover:bg-blue-600 transition"
                />
            }
        />
    );
}
