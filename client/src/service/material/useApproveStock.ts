import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TUseApproveStockProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const UseApproveStock = (props?: TUseApproveStockProps) => {
  const [isLoadingApprove, setIsloading] = useState<boolean>(false);
  const UseApproveStockFn = async (params: { id: number; status: string }) => {
    try {
      setIsloading(true);
      const response = await HeroServices.put(`/stock/status/${params?.id}`, {
        status: params?.status,
      });

      const { status, data } = response;

      if (status !== 200) return;

      return data?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["UseApproveStock"],
    mutationFn: UseApproveStockFn,
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

  return { ...mutation, isLoadingApprove };
};

export default UseApproveStock;
