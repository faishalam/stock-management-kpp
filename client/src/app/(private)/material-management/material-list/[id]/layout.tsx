"use client";
import { Suspense } from "react";
import { MaterialListDetailProvider } from "./hooks";
import { BlockingLoader } from "@/components/atoms/loader";

type TProps = {
  children: React.ReactNode;
};
const MaterialListLayout: React.FC<TProps> = ({ children }) => {
  return (
    <Suspense fallback={<BlockingLoader />}>
      <MaterialListDetailProvider>{children}</MaterialListDetailProvider>
    </Suspense>
  );
};
export default MaterialListLayout;
