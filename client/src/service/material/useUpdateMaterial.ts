import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";
import { TMaterialFormInput } from "@/app/(private)/material-management/material-list/types";

type TUpdateMaterialProps = {
  onSuccess?: (data: TMaterialFormInput) => void;
  onError?: (error: unknown) => void;
};

const useUpdateMaterial = (props: TUpdateMaterialProps) => {
  const [isLoadingUpdateMaterial, setIsLoading] = useState<boolean>(false);

  const useUpdateMaterialFn = async (body: TMaterialFormInput) => {
    try {
      setIsLoading(true);
      if(!body?.id) return
      const response = await HeroServices.put(`/material/${body?.id}`, body);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateMaterial"],
    mutationFn: useUpdateMaterialFn,
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

  return { ...mutation, isLoadingUpdateMaterial };
};

export default useUpdateMaterial;
