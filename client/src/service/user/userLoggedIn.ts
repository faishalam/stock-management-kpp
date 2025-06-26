"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";

const useUserLogged = () => {
  const [isLoadingGetUserLoggedIn, setIsLoading] = useState<boolean>(false);

  const useUserLoggedFn = async () => {
    try {
      setIsLoading(true);
      const response = await HeroServices.get("/getLoggedInUser");

      if (response.status !== 200) return;
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const query = useQuery({
    queryKey: ["useUserLogged"],
    queryFn: useUserLoggedFn,
  });

  return { ...query, isLoadingGetUserLoggedIn };
};

export default useUserLogged;
