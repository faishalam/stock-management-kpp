import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMaterialStockInput } from "@/app/(private)/stock-management/request/types";

type TUpdateHargaStockProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useUpdateHargaStock = (props: TUpdateHargaStockProps) => {
  const [isLoadingUpdateHargaStock, setIsLoading] = useState<boolean>(false);

  const useUpdateHargaStockFn = async (body: TMaterialStockInput) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.put(`/stock/price/${body?.id}`, {
        hargaSatuan: body?.hargaSatuan,
        hargaTotal: body?.hargaTotal,
      });

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateHargaStock"],
    mutationFn: useUpdateHargaStockFn,
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

  return { ...mutation, isLoadingUpdateHargaStock };
};

export default useUpdateHargaStock;
