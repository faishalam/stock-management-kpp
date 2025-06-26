import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseStatusStockProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useStatusStock = (props?: TuseStatusStockProps) => {
  const [isLoadingStatusStock, setIsloading] = useState<boolean>(false);
  const useStatusStockFn = async (params: {
    status: string;
    id: number;
    reasonRevise: string | null;
  }) => {
    try {
      setIsloading(true);
      const response = await HeroServices.put(`/stock/status`, {
        status: params?.status,
        id: params?.id,
        reasonRevise: params?.reasonRevise ?? null,
      });

      const { status } = response;

      if (status !== 200) {
        throw new Error("Failed to update status");
      }

      return response?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useStatusStock"],
    mutationFn: useStatusStockFn,
    onSuccess: (response) => {
      if (response) {
        props?.onSuccess?.(response);
      }
    },
    onError: (error) => {
      if (props?.onError) {
        props.onError(error);
      }
    },
  });

  return { ...mutation, isLoadingStatusStock };
};

export default useStatusStock;
