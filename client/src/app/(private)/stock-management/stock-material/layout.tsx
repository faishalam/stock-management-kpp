"use client";

import { StockMaterialProvider } from "./hooks";

type TProps = {
  children: React.ReactNode;
};
const RequestMaterialLayout: React.FC<TProps> = ({ children }) => {
  return <StockMaterialProvider>{children}</StockMaterialProvider>;
};
export default RequestMaterialLayout;
