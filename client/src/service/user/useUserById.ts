import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseUserByIdProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
  params: {
    id: number | null;
  };
};

const useUserById = (props?: TuseUserByIdProps) => {
  const useUserByIdFn = async () => {
    try {
      const response = await HeroServices.get(`/user/${props?.params.id}`);

      const { status } = response;

      if (status !== 200) return;

      return response?.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    }
  };

  const query = useQuery({
    queryKey: ["useUserById", props?.params],
    queryFn: useUserByIdFn,
    staleTime: Infinity,
    enabled: Boolean(props?.params?.id),
  });

  return { ...query };
};

export default useUserById;
