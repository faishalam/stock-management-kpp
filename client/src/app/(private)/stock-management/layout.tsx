"use client";

import { Suspense } from "react";

type TProps = {
  children: React.ReactNode;
};
const StockManagementLayout: React.FC<TProps> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};
export default StockManagementLayout;
