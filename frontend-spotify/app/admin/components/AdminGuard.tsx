"use client";

import { useEffect, ReactNode } from "react";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.profile?.profile);
  const loading = useAppSelector((state) => state.profile?.loading);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang kiểm tra quyền..." />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
