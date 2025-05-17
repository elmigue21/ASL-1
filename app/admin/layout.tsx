// app/admin/layout.tsx
"use client";

import RoleGuard from "../components/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard>{children}</RoleGuard>;
}
