"use client";

import { useMutation } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";
import { TMasterInputList } from "./types";

type TAddMaterialProps = {
  onSuccess?: (data: TMasterInputList) => void;
  onError?: (error: unknown) => void;
};

const useAddMaterial = (props: TAddMaterialProps) => {
  const useAddMaterialFn = async (body: TMasterInputList) => {
    try {
      const response = await HeroServices.post(`/material`, body);
      if (response.status !== 200) return;
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useAddMaterial"],
    mutationFn: useAddMaterialFn,
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

  return { ...mutation };
};

export default useAddMaterial;
