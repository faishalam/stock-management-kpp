import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HeroServices } from "../HeroService";

type TDeleteRequestProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useDeleteRequest = (props: TDeleteRequestProps) => {
  const [isLoadingDeleteRequest, setIsLoading] = useState<boolean>(false);

  const useDeleteRequestFn = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await HeroServices.delete(`/request-material/${id}`);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeleteRequest"],
    mutationFn: useDeleteRequestFn,
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

  return { ...mutation, isLoadingDeleteRequest };
};

export default useDeleteRequest;
