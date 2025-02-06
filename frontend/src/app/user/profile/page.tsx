import Link from "next/link";
import { SettingFilled } from "@ant-design/icons";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

export default async function Profile() {
    const session = await auth();
    const name = session?.user?.name;
    return (
        <div>
            {name && <h2>Welcome, {name}!</h2>}
            <UserAvatar />

            <Link
                href={"/user/settings"}
                className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
            >
                <SettingFilled className="text-4xl" />
            </Link>
        </div>
    );
}
