import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseUpdateRequestProps = {
  onSuccess?: (data: number) => void;
  onError?: (error: unknown) => void;
};

const useUpdateRequest = (props?: TuseUpdateRequestProps) => {
  const useUpdateRequestFn = async (params: { quantity: number, id: number }) => {
    try {
      const response = await HeroServices.put(
        `/request-material/${params?.id}`,
        {
          quantity: params?.quantity,
        }
      );

      const { status } = response;

      if (status !== 200) {
        throw new Error("Failed to update status");
      }

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateRequest"],
    mutationFn: useUpdateRequestFn,
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

export default useUpdateRequest;
