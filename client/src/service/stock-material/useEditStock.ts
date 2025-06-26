import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMaterialStockInput } from "@/app/(private)/stock-management/request/types";

type TEditStockProps = {
  onSuccess?: (data: TMaterialStockInput) => void;
  onError?: (error: unknown) => void;
};

const useEditStock = (props: TEditStockProps) => {
  const [isLoadingEditStock, setIsLoading] = useState<boolean>(false);

  const useEditStockFn = async (body: TMaterialStockInput) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.put(`/stock/${body?.id}`, {
        materialId: body?.materialId,
        quantity: body?.quantity,
        hargaSatuan: body?.hargaSatuan ?? null,
        hargaTotal: body?.hargaTotal ?? null,
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
    mutationKey: ["useEditStock"],
    mutationFn: useEditStockFn,
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

  return { ...mutation, isLoadingEditStock };
};

export default useEditStock;
