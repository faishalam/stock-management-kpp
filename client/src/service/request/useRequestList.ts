import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseRequestMaterialListProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  };
};

const useRequestMaterialList = (props?: TuseRequestMaterialListProps) => {
  const [isLoadingRequestMaterialList, setIsloading] = useState<boolean>(false);
  const useRequestMaterialListFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/request-material`, {
        params: {
          ...(props?.params?.status && { status: props.params.status }),
        },
      });

      const { status, data } = response;

      if (status !== 200) return;

      return data?.data;
    } catch (error) {
      setIsloading(false);
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response?.data?.message || "Unknown error";
    } finally {
      setIsloading(false);
    }
  };

  const query = useQuery({
    queryKey: ["useRequestMaterialList", props?.params],
    queryFn: useRequestMaterialListFn,
    staleTime: Infinity,
    enabled: Boolean(
      props?.params?.search ||
        props?.params?.page ||
        props?.params?.limit ||
        props?.params?.status
    ),
  });

  return { ...query, isLoadingRequestMaterialList };
};

export default useRequestMaterialList;
