"use client";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { login } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Spin } from "antd";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";

export default function LoginPage() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();
  const { requesting, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Redirect nếu đã login - dùng useEffect thay vì gọi trực tiếp
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      if (result) {
        toast.success("Login successful!", "Redirecting...");
        // Redirect to home (main layout will be applied via route group)
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Login failed", error || "Please try again");
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
          <p className="text-gray-400">Web Player Clone</p>
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
                { type: "email", message: "Invalid email!" },
              ]}
            >
              <Input
                placeholder="your@email.com"
                size="large"
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
              ]}
            >
              <Input.Password
                placeholder="Password"
                size="large"
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
                style={{
                  backgroundColor: "#1DB954",
                  borderColor: "#1DB954",
                  height: "40px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {requesting ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>

            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                href="/register"
                className="text-green-500 hover:text-green-400"
              >
                Register here
              </Link>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
