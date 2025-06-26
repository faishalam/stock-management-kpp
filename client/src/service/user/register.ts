import { useMutation } from "@tanstack/react-query";
import { AuthServices } from "../AuthService";
import { TInputRegister, TRegisterResponse } from "./types";
import { NetworkAPIError } from "@/utils/response-type";
import { AxiosError } from "axios";

type TuseRegisterProps = {
  onSuccess?: (data: TRegisterResponse) => void;
  onError?: (error: unknown) => void;
};

const useRegister = (props?: TuseRegisterProps) => {
  const useRegisterFn = async (formRegister: TInputRegister) => {
    try {
      const response = await AuthServices.post(`/register`, formRegister);

      console.log(response);
      const { status } = response;

      if (status !== 200) return;
      return response.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const mutation = useMutation({
    mutationKey: ["useRegister"],
    mutationFn: useRegisterFn,
    onSuccess: (data) => {
      if (data) {
        props?.onSuccess?.(data);
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

export default useRegister;
