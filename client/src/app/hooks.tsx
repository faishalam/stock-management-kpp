"use client";

import useUserLogged from "@/service/user/userLoggedIn";
import { createContext, useContext, useState } from "react";

const useAuthHooks = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { data: dataUser, isLoading: isLoadingGetUserLoggedIn } =
    useUserLogged();

  return {
    dataUser,
    isLoadingGetUserLoggedIn,
    sidebarOpen,
    setSidebarOpen,
  };
};

const useAuthContext = createContext<
  ReturnType<typeof useAuthHooks> | undefined
>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useAuthHooks();
  return (
    <useAuthContext.Provider value={value}>{children}</useAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(useAuthContext);
  if (context === undefined) {
    throw new Error("useuseAuthContext must be used within an AuthProvider");
  }
  return context;
};
export default useAuth;
