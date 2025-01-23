import Link from "next/link";
import React from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Navbar = () => {
    const user = {};
    return (
        <nav className="flex gap-6 justify-center font-semibold text-lg md:text-xl">
            <Link href={"/"} className="hidden sm:block">
                Home
            </Link>
            <Link href={"/courses"} className="hidden sm:block">
                Courses
            </Link>
            <Link href={"/"}>
                <div>
                    <AccountCircleOutlinedIcon />
                </div>
            </Link>
        </nav>
    );
};

export default Navbar;
