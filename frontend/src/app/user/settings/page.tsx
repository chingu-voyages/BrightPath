"use client";
import React from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { Upload as UploadIcon } from "@mui/icons-material";
import { UploadChangeParam } from "antd/es/upload";

export const dynamic = "force-dynamic";

interface UserData {
    name?: string;
    username?: string;
    email?: string;
    image?: string;
    bio?: string;
}

export default function UserSettings() {
    const [form] = Form.useForm<UserData>();

    (async () => {
        try {
            const response = await fetch("/api/user");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data: UserData = await response.json();
            form.setFieldsValue(data);
        } catch (error) {
            console.log("Failed to load user data.");
        }
    })();

    const onFinish = async (values: UserData) => {
        try {
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error("Failed to update user information");
            }
            message.success("User information updated successfully!");
        } catch (error) {
            message.error("Failed to update user information.");
        }
    };

    const handleUpload = (info: UploadChangeParam) => {
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
                            action="/api/upload"
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
