"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Spin } from "antd";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";
import { register } from "@/store/slices/auth";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();
  const { requesting, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  // Redirect nếu đã login - dùng useEffect thay vì gọi trực tiếp
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      toast.error("Registration failed", error);
    }
  }, [error, toast]);

  const onFinish = async (values: any) => {
    try {
      const registerDto = {
        email: values.email,
        password: values.password,
      };

      const result = await dispatch(register(registerDto)).unwrap();

      toast.success("Account created!", "Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      toast.error("Registration failed", error || "Please try again");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#282828",
          border: "1px solid #404040",
        }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-500 mb-2">Spotify</h1>
          <p className="text-gray-400">Create Account</p>
        </div>

        <Spin spinning={requesting}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                placeholder="your@email.com"
                size="large"
                disabled={requesting}
                style={{
                  backgroundColor: "#404040",
                  border: "1px solid #535353",
                  color: "#fff",
                }}
                className="placeholder-gray-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password
                placeholder="Min 6 characters"
                size="large"
                disabled={requesting}
                style={{
                  backgroundColor: "#404040",
                  border: "1px solid #535353",
                  color: "#fff",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Confirm Password</span>}
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm password"
                size="large"
                disabled={requesting}
                style={{
                  backgroundColor: "#404040",
                  border: "1px solid #535353",
                  color: "#fff",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={requesting}
                disabled={requesting}
                style={{
                  backgroundColor: "#1DB954",
                  borderColor: "#1DB954",
                  height: "40px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {requesting ? "Creating Account..." : "Create Account"}
              </Button>
            </Form.Item>

            <div className="text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                href="/login"
                className="text-green-500 hover:text-green-400"
              >
                Login here
              </Link>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
