import { useMutation } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseStatusRequestProps = {
  onSuccess?: (data: number) => void;
  onError?: (error: unknown) => void;
};

const useStatusRequest = (props?: TuseStatusRequestProps) => {
  const useStatusRequestFn = async (params: {
    status: string;
    id: number;
    reasonRevise: string | null;
  }) => {
    try {
      const response = await HeroServices.put(
        `/request-material/status/${params?.id}`,
        {
          status: params?.status,
          reasonRevise: params?.reasonRevise ?? null,
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
    mutationKey: ["useStatusRequest"],
    mutationFn: useStatusRequestFn,
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

export default useStatusRequest;
