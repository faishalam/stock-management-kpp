"use client";

import { MaterialProvider } from "./hooks";

type TProps = {
  children: React.ReactNode;
};
const RequestMaterialLayout: React.FC<TProps> = ({ children }) => {
  return <MaterialProvider>{children}</MaterialProvider>;
};
export default RequestMaterialLayout;
