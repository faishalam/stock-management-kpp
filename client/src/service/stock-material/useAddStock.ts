import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMaterialStockInput } from "@/app/(private)/stock-management/request/types";

type TAddStockProps = {
  onSuccess?: (data: TMaterialStockInput) => void;
  onError?: (error: unknown) => void;
};

const useAddStock = (props: TAddStockProps) => {
  const [isLoadingAddStock, setIsLoading] = useState<boolean>(false);

  const useAddStockFn = async (body: TMaterialStockInput) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.post(`/stock`, body);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useAddStock"],
    mutationFn: useAddStockFn,
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

  return { ...mutation, isLoadingAddStock };
};

export default useAddStock;
