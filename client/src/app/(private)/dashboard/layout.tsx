"use client";

import { DashboardProvider } from "./hooks";

type TProps = {
  children: React.ReactNode;
};
const DashboardLayout: React.FC<TProps> = ({ children }) => {
  return <DashboardProvider>{children}</DashboardProvider>;
};
export default DashboardLayout;
