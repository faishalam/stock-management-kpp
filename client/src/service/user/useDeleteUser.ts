import { useMutation } from "@tanstack/react-query";
import { HeroServices } from "../HeroService";

type TDeleteUserProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
};

const useDeleteUser = (props: TDeleteUserProps) => {
  const useDeleteUserFn = async (id: number) => {
    try {
      const response = await HeroServices.delete(`/user/${id}`);

      if (response.status !== 200) return;

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationKey: ["useDeleteUser"],
    mutationFn: useDeleteUserFn,
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

export default useDeleteUser;
