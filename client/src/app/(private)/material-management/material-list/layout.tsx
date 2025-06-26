"use client";

import { MaterialListProvider } from "./hooks";

type TProps = {
  children: React.ReactNode;
};
const MaterialListLayout: React.FC<TProps> = ({ children }) => {
  return <MaterialListProvider>{children}</MaterialListProvider>;
};
export default MaterialListLayout;
