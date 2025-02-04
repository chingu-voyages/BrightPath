import Link from "next/link";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@/auth";

export default async function Profile() {
    const session = await auth();
    const name = session?.user?.name;
    return (
        <div>
            {name && <h2>Welcome, {name}!</h2>}

            <Link
                href={"/user/settings"}
                className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
            >
                <div>
                    <SettingsOutlinedIcon />
                </div>
            </Link>
        </div>
    );
}
