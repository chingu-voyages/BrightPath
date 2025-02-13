import Link from "next/link";
import React from "react";
import { Footer } from "antd/es/layout/layout";
import Image from "next/image";
import Text from "antd/es/typography/Text";

const slogan: string = `"Learn in Public. \n
Grow in community."`;

export default function AppFooter() {
    return (
        <Footer className="w-full justify-center p-0 pt-2 mt-auto shadow-sm bg-[#319CCA]">
            <section className="flex flex-col sm:flex-row w-full justify-center items-center sm:items-start gap-[1.5rem] p-6 pt-8 shadow-sm bg-[#0B516F]">
                <div className="flex flex-col justify-start w-[300px] sm:h-[250px] gap-4">
                    <Image
                        src="/Logo_DarkM.png"
                        alt="Logo"
                        width={280}
                        height={63}
                    />
                    <h2 className="w-full text-white text-lg sm:text-sm md:text-lg flex flex-col ">
                        <span>"Learn in Public.</span>
                        <span>Grow in community."</span>
                    </h2>
                </div>

                <div className="flex flex-col w-[300px] gap-2 pt-1 md:pt-3 lg:pt-4 xl:pt-5">
                    <h1 className="text-white text-2xl">Attribution</h1>
                    <div className="flex sm:flex-col md:flex-row justify-start items-start gap-2">
                        <Image
                            src="/volunteer_activism.svg"
                            alt="Logo"
                            width={20}
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
                    <div className="flex sm:flex-col md:flex-row justify-start gap-2">
                        <Image
                            src="/home.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                        />
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

                <div className="flex flex-col w-[300px] sm:w-[260px] gap-2 pt-1 md:pt-3 lg:pt-4 xl:pt-5">
                    <h1 className="text-white text-2xl">Licensing</h1>
                    <div className="flex sm:flex-col md:flex-row justify-start items-start gap-2">
                        <Image
                            src="/palette.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                        />
                        <Text className="text-white">
                            <span className="font-bold">
                                BrightPath branding and graphics{" "}
                            </span>
                            <span>© 2025 by the </span>
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
                    <div className="flex sm:flex-col md:flex-row justify-start items-start gap-2">
                        <Image
                            src="/frame_source.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                        />
                        <Text className="text-white">
                            <span className="font-bold">
                                The BrightPath platform{" "}
                            </span>
                            is open source! Find our code on Github.
                        </Text>
                    </div>
                    <div className="flex sm:flex-col md:flex-row justify-start items-start gap-2">
                        <Image
                            src="/dictionary.svg"
                            alt="Logo"
                            width={20}
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
            </section>
        </Footer>
    );
}
