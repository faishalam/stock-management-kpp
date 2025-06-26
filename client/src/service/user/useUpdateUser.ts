import { useMutation } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";
import { TInputRegister } from "./types";

type TUpdateUserProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useUpdateUser = (props: TUpdateUserProps) => {
  const useUpdateUserFn = async (body: TInputRegister) => {
    try {
      if (!body?.id) return;
      const response = await HeroServices.put(`/user/${body?.id}`, body);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useUpdateUser"],
    mutationFn: useUpdateUserFn,
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

export default useUpdateUser;
