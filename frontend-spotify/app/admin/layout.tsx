import { ReactNode } from "react";
import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./components/AdminLayout";

export const metadata = {
  title: "Admin Panel - Spotify Clone",
  description: "Admin dashboard for managing Spotify clone",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
