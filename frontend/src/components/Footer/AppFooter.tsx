import Link from "next/link";
import React from "react";
import { Footer } from "antd/es/layout/layout";
import { Image } from "antd";
import { HomeOutlined } from "@mui/icons-material";
import Text from "antd/es/typography/Text";

const slogan: string = `"Learn in Public. \n
Grow in community."`;

export default function AppFooter() {
    return (
        <Footer className="flex w-full gap-24 p-6 md:px-12 lg:px-28 xl:px-48 2xl:px-72 mt-6 rounded-md md:rounded-xl shadow-sm border border-slate-300 dark:border-slate-800 bg-[#0B516F]">
            {/* footer*/}
            <div className="flex flex-col justify-start items-center h-[250px] gap-4">
                <Link href={"/"} className="font-semibold ">
                    <Image
                        src="/Logo_DarkM.png"
                        alt="Logo"
                        width={280}
                        height={63}
                    />
                </Link>
                <h2 className="text-white text-lg flex flex-col items-center">
                    <span>"Learn in Public.</span>
                    <span>Grow in community."</span>
                </h2>
            </div>

            <div className="flex flex-col w-[300px] gap-2">
                <h1 className="text-white text-2xl">Attribution</h1>
                <div className="flex justify-start gap-1">
                    <Image
                        src="/volunteer_activism.svg"
                        alt="Logo"
                        width={50}
                        height={20}
                    />
                    <Text className="text-white">
                        Designed and developed by the{" "}
                        <Link
                            href="https://github.com/chingu-voyages/BrightPath"
                            target="_blank"
                            className="text-white underline"
                        >
                            Go Getters
                        </Link>
                        :{" "}
                        <Link
                            href="https://www.linkedin.com/in/zuwaira-aliyu-mohammed"
                            target="_blank"
                            className="text-white underline"
                        >
                            @zuweeali
                        </Link>
                        ,{" "}
                        <Link
                            href="https://www.linkedin.com/in/joekotvas"
                            target="_blank"
                            className="text-white underline"
                        >
                            @joekotvas
                        </Link>
                        ,{" "}
                        <Link
                            href="https://www.linkedin.com/in/frederic-brueningf"
                            target="_blank"
                            className="text-white underline"
                        >
                            @brueningf
                        </Link>
                        ,{" "}
                        <Link
                            href="https://www.linkedin.com/in/jordan~kelsey"
                            target="_blank"
                            className="text-white underline"
                        >
                            @ProgramStuff
                        </Link>
                        ,{" "}
                        <Link
                            href="https://www.linkedin.com/in/sunnymaster"
                            target="_blank"
                            className="text-white underline"
                        >
                            @Sunny-Master
                        </Link>
                        ,{" "}
                        <Link
                            href="https://www.linkedin.com/in/robert-varchodi-633515217"
                            target="_blank"
                            className="text-white underline"
                        >
                            @varchodi
                        </Link>
                        .
                    </Text>
                </div>
                <div className="flex justify-start gap-1">
                    <Image src="/home.svg" alt="Logo" width={20} height={20} />
                    <Text className="text-white">
                        Facilitated by{" "}
                        <Link
                            href="https://www.chingu.io/"
                            target="_blank"
                            className="text-white underline"
                        >
                            Chingu.
                        </Link>
                    </Text>
                </div>
            </div>

            <div className="flex flex-col w-[300px] gap-2">
                <h1 className="text-white text-2xl">Licensing</h1>
                <div className="flex justify-start gap-1">
                    <Image
                        src="/palette.svg"
                        alt="Logo"
                        width={20}
                        height={20}
                    />
                    <Text className="text-white">
                        <span className="font-bold">
                            BrightPath branding and graphics <br />
                        </span>
                        © 2025 by the{" "}
                        <Link
                            href="https://github.com/chingu-voyages/BrightPath"
                            target="_blank"
                            className="text-white underline"
                        >
                            Go Getters
                        </Link>
                        :{"."}
                    </Text>
                </div>
                <div className="flex justify-start gap-1">
                    <Image
                        src="/frame_source.svg"
                        alt="Logo"
                        width={40}
                        height={20}
                    />
                    <Text className="text-white">
                        <span className="font-bold">
                            The BrightPath platform{" "}
                        </span>
                        is open source! Find our code on Github.
                    </Text>
                </div>
                <div className="flex justify-start gap-1">
                    <Image
                        src="/dictionary.svg"
                        alt="Logo"
                        width={50}
                        height={20}
                    />
                    <Text className="text-white">
                        <span className="font-bold">
                            All rights to each course{" "}
                        </span>
                        remain with the instructors - used by permission.
                    </Text>
                </div>
            </div>
        </Footer>
    );
}
