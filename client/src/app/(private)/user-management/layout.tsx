"use client";

import { UserManagementProvider } from "./hooks";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserManagementProvider>{children}</UserManagementProvider>
    </>
  );
}
