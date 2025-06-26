import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TMasterInputList } from "./types";

type TuseMaterialListByIdProps = {
  onSuccess?: (data: TMasterInputList) => void;
  onError?: (error: unknown) => void;
  params: {
    id: number;
  };
};

const useMaterialListById = (props?: TuseMaterialListByIdProps) => {
  const [isLoadingMaterialListById, setIsloading] = useState<boolean>(false);
  const useMaterialListByIdFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/material/${props?.params.id}`);

      const { status } = response;

      if (status !== 200) return;

      return response?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const query = useQuery({
    queryKey: ["useMaterialListById", props?.params],
    queryFn: useMaterialListByIdFn,
    staleTime: Infinity,
    enabled: Boolean(props?.params?.id),
  });

  return { ...query, isLoadingMaterialListById };
};

export default useMaterialListById;
