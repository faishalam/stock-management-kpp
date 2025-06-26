import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMasterMaterialList } from "@/app/(private)/material-management/material-list/types";

type TDeleteMaterialStockProps = {
  onSuccess?: (data: TMasterMaterialList) => void;
  onError?: (error: unknown) => void;
};

const useDeleteMaterialStock = (props: TDeleteMaterialStockProps) => {
  const [isLoadingDeleteMaterialStock, setIsLoading] = useState<boolean>(false);

  const useDeleteMaterialStockFn = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.delete(`/stock/${id}`);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeleteMaterialStock"],
    mutationFn: useDeleteMaterialStockFn,
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

  return { ...mutation, isLoadingDeleteMaterialStock };
};

export default useDeleteMaterialStock;
