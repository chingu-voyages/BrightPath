"use client";
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function PasswordChange() {
    const { data: session } = useSession();
    const [form] = Form.useForm<ChangePasswordFormData>();
    const router = useRouter(); 

    const onFinish = async (values: ChangePasswordFormData) => {
        try {
            if (values.newPassword !== values.confirmPassword) {
                message.error('New passwords do not match');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${session?.user?.id}/change-password`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentPassword: values.currentPassword || '',
                        newPassword: values.newPassword,
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            alert(data.message);
            form.resetFields();
            router.push("/user/profile");
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4 mb-4 w-auto max-w-lg">
            <h2 className="text-xl text-black mb-4">Change Password</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    help="Leave blank if you haven't set a password before"
                >
                    <Input.Password placeholder="Enter current password" />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                        { min: 8, message: 'Password must be at least 8 characters!' }
                    ]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}