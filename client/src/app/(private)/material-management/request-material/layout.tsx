"use client";

import { RequestMaterialProvider } from "./hooks";

type TProps = {
  children: React.ReactNode;
};
const RequestMaterialLayout: React.FC<TProps> = ({ children }) => {
  return <RequestMaterialProvider>{children}</RequestMaterialProvider>;
};
export default RequestMaterialLayout;
