"use client";
import React from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { Upload as UploadIcon } from "@mui/icons-material";
import { UploadChangeParam } from "antd/es/upload";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

type UserData = Prisma.UserGetPayload<{}>;

export const dynamic = "force-dynamic";

export default function UserSettings() {
    const [form] = Form.useForm<UserData>();

    (async () => {
        try {
            const session = await auth();
            if (!session?.user) {
                throw new Error("User not authenticated");
            }
            const userData: UserData = session.user;
            form.setFieldsValue(userData);
        } catch (error) {
            console.log("Failed to load user data.");
        }
    })();

    const onFinish = async (values: Partial<UserData>) => {
        try {
            const session = await auth();
            if (!session?.user?.id) {
                throw new Error("User not authenticated");
            }
            const response = await fetch(
                process.env.BACKEND_API_URL + `/user/${session.user.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                },
            );
            if (!response.ok) {
                throw new Error("Failed to update user information");
            }
            message.success("User information updated successfully!");
        } catch (error) {
            message.error("Failed to update user information.");
            console.error("Error updating user:", error);
        }
    };

    const handleUpload = (info: UploadChangeParam) => {
        console.log(info)
        if (info.file.status === "done") {
            // Assuming the server responds with the uploaded image URL
            const imageUrl = info.file.response.url;
            form.setFieldsValue({ image: imageUrl });
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <div className="flex items-center flex-col w-full p-0">
            <h1 className="mt-4">Settings</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 mb-4 w-auto max-w-lg">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: "",
                        username: "",
                        email: "",
                        image: "",
                        bio: "",
                    }}
                >
                    <Form.Item name="name" label="Name">
                        <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item name="username" label="Username">
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item name="bio" label="Bio">
                        <Input.TextArea
                            placeholder="Enter a short bio"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item name="image" label="Profile Image">
                        <Upload
                            name="file"
                            action={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/upload`}
                            listType="picture"
                            onChange={handleUpload}
                        >
                            <Button icon={<UploadIcon />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Information
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
