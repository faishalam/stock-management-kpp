import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TMasterMaterialList } from "@/app/(private)/material-management/material-list/types";

type TuseMaterialListProps = {
  onSuccess?: (data: TMasterMaterialList[]) => void;
  onError?: (error: unknown) => void;
  params?: {
    search?: string;
    page?: number;
    limit?: number;
  };
};

const useMaterialListAPI = (props?: TuseMaterialListProps) => {
  const [isLoadingMaterialList, setIsloading] = useState<boolean>(false);
  const useMaterialListFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/material`, {
        params: {
          ...(props?.params?.page && { page: props.params.page }),
          // ...(props?.params?.status && { status: props.params.status }),
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
    queryKey: ["useMaterialList", props?.params],
    queryFn: useMaterialListFn,
    staleTime: Infinity,
    enabled: Boolean(
      props?.params?.search || props?.params?.page || props?.params?.limit
    ),
  });

  return { ...query, isLoadingMaterialList };
};

export default useMaterialListAPI;
