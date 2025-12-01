import { AppLayout } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <AppLayout>{children}</AppLayout>;
}
