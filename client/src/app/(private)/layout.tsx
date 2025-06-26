"use client";
import Sidebar from "@/components/molecules/sidebar";
import MobileSidebar from "@/components/molecules/mobileSidebar";
import Navbar from "@/components/molecules/navbar";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "../hooks";
import { Suspense } from "react";
const theme = createTheme();

type TProps = {
  children?: React.ReactNode;
};
const PrivateLayout: React.FC<TProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="w-full max-w-full min-h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <MobileSidebar />
        <div className="lg:pl-72 w-full max-w-full">
          <main className="py-6 w-full max-w-full ">
            <div className="px-4 sm:px-6 lg:px-8 w-full">
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};
export default PrivateLayout;
