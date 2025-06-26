import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseUserListProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  };
};

const useUserList = (props?: TuseUserListProps) => {
  const [isLoadingMaterialStock, setIsloading] = useState<boolean>(false);
  const useUserListFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/user`, {
        params: {
          ...(props?.params?.page && { page: props.params.page }),
          ...(props?.params?.status && { status: props.params.status }),
        },
      });

      if (response.status !== 200) return;

      return response?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const query = useQuery({
    queryKey: ["useUserList", props?.params],
    queryFn: useUserListFn,
    staleTime: Infinity,
    enabled: Boolean(
      props?.params?.search ||
        props?.params?.page ||
        props?.params?.limit ||
        props?.params?.status
    ),
  });

  return { ...query, isLoadingMaterialStock };
};

export default useUserList;
