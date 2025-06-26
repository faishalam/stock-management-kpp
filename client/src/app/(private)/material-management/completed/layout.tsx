"use client";

import { RequestMaterialCompletedProvider } from "./hooks";


type TProps = {
  children: React.ReactNode;
};
const RequestMaterialCompletedLayout: React.FC<TProps> = ({ children }) => {
  return <RequestMaterialCompletedProvider>{children}</RequestMaterialCompletedProvider>;
};
export default RequestMaterialCompletedLayout;
