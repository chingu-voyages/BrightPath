import Link from "next/link";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Image } from "antd";

export default async function Profile() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="w-full flex gap-2 p-6">
            {/* {name && <h2>Welcome, {name}!</h2>}

            <Link
                href={"/user/settings"}
                className="text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
            >
                <div>
                    <SettingsOutlinedIcon />
                </div>
            </Link> */}
            {/* user infos */}
            <section className="min-w-72 bg-slate-50 dark:bg-slate-800 p-4 rounded-md font-semibold text-xl">
                <article className="flex flex-col gap-4 justify-center items-center p-2 border-b relative ">
                    <Link
                            href={"/user/settings"}
                            className="absolute right-0 top-0 text-slate-700 dark:text-slate-100 hover:opacity-75 delay-500"
                        >
                            <div>
                                <SettingsOutlinedIcon />
                            </div>
                    </Link>
                    <h1 >Personal Details</h1>
                    <Image src={user?.image ? user.image : "/globe.svg"} width={72} className="border p-1 rounded-full" />
                    <div className="text-base">
                        {<p className="">UserName: {user?.name ? user.name : "NA"}</p>}
                        {user?.email && <p className="">Email: {user.email}</p>}
                    </div>
                </article>
            </section>
            <section className="flex-1 w-full border bg-slate-50 dark:bg-slate-800">
                .
            </section>

            
        </div>
    );
}
