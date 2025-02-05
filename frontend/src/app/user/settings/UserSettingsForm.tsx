"use client";
import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { Upload as UploadIcon } from "@mui/icons-material";
import type {
    UploadFile,
    UploadProps,
    UploadChangeParam,
} from "antd/es/upload";
import { useSession } from "next-auth/react";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";

export default function UserSettingsForm() {
    const { data: session, update } = useSession();
    const [form] = Form.useForm<User>();
    const router = useRouter();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFinish = async (values: Partial<User>) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${session?.user?.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                },
            );

            if (!response.ok) throw new Error();

            await update(values);
            message.success("Updated successfully!");
            router.push("/user/profile");
        } catch {
            message.error("Update failed");
        }
    };

    const handleChange: UploadProps["onChange"] = (info: UploadChangeParam) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        console.log(info.file.response);
        if (info.file.status === "done") {
            form.setFieldsValue({
                image: info.file.response.url.split("/").at(-1),
            });
            message.success("Upload successful");
        } else if (info.file.status === "error") {
            message.error("Upload failed");
        }
        setFileList(newFileList);
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 mb-4 w-auto max-w-lg">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={session?.user}
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
                    <Input.TextArea placeholder="Enter a short bio" rows={4} />
                </Form.Item>

                <Form.Item name="image" label="Change Avatar">
                    <Upload
                        name="file"
                        action={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/upload`}
                        listType="picture"
                        onChange={handleChange}
                        fileList={fileList}
                    >
                        <Button icon={<UploadIcon />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Information
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
