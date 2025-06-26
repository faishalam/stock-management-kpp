import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMasterInputList } from "./types";

type TDeleteMaterialProps = {
  onSuccess?: (data: TMasterInputList) => void;
  onError?: (error: unknown) => void;
};

const useDeleteMaterial = (props: TDeleteMaterialProps) => {
  const [isLoadingDeleteMaterial, setIsLoading] = useState<boolean>(false);

  const useDeleteMaterialFn = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.delete(`/material/${id}`);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeleteMaterial"],
    mutationFn: useDeleteMaterialFn,
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

  return { ...mutation, isLoadingDeleteMaterial };
};

export default useDeleteMaterial;
