import Link from "next/link";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Profile() {
    return (
        <Link
            href={"/user/settings"}
            className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
        >
            <div>
                <SettingsOutlinedIcon />
            </div>
        </Link>
    );
}
