"use client";

import { useMutation } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";
import { TRequestMaterialInput } from "@/app/(private)/material-management/material-list/types";
import { AxiosError } from "axios";
import { NetworkAPIError } from "@/utils/response-type";

type TAddRequestProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useAddRequest = (props: TAddRequestProps) => {
  const useAddRequestFn = async (body: TRequestMaterialInput) => {
    try {
      const response = await HeroServices.post(`/request-material`, body);
      if (response.status !== 200) return;
      return response.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useAddRequest"],
    mutationFn: useAddRequestFn,
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

export default useAddRequest;
