import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TMasterMaterialStockList } from "@/app/(private)/stock-management/request/types";

type TuseMaterialStockListProps = {
  onSuccess?: (data: TMasterMaterialStockList[]) => void;
  onError?: (error: unknown) => void;
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
  };
};

const useMaterialStockList = (props?: TuseMaterialStockListProps) => {
  const [isLoadingMaterialStock, setIsloading] = useState<boolean>(false);
  const useMaterialStockListFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/stock`, {
        params: {
          ...(props?.params?.page && { page: props.params.page }),
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
    queryKey: ["useMaterialStockList", props?.params],
    queryFn: useMaterialStockListFn,
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

export default useMaterialStockList;
