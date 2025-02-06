import { Dropdown, MenuProps } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

const UserMenu = () => {

    const items: MenuProps["items"] = [
        {
        key: "profile",
        label: <Link href="/user/profile">Profile</Link>,
        icon: <UserOutlined />,
        },
        {
        key: "settings",
        label: <Link href="/user/settings">Settings</Link>,
        icon: <SettingOutlined />,
        },
        {
        type: "divider",
        },
        {
        key: "signout",
        label: <Link href="/auth/signout">Signout</Link>,
        icon: <LogoutOutlined />,
        danger: true,
        },
    ];


    return (
        <Dropdown menu={{items}} trigger={["click"]} placement="bottomRight">
            <span>
                <UserAvatar />
            </span>
        </Dropdown>
    );
};

export default UserMenu;
