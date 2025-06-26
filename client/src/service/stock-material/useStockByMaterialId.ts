import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { useState } from "react";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";
import { TMasterMaterialStockList } from "@/app/(private)/stock-management/request/types";

type TuseStockByMaterialIdProps = {
  onSuccess?: (data: TMasterMaterialStockList) => void;
  onError?: (error: unknown) => void;
  params: {
    id: number;
  };
};

const useStockByMaterialId = (props?: TuseStockByMaterialIdProps) => {
  const [isLoadingStockByMaterialId, setIsloading] = useState<boolean>(false);
  const useStockByMaterialIdFn = async () => {
    try {
      setIsloading(true);
      const response = await HeroServices.get(`/stock/${props?.params.id}`);

      const { status } = response;

      if (status !== 200) return;

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
    queryKey: ["useStockByMaterialId", props?.params],
    queryFn: useStockByMaterialIdFn,
    enabled: Boolean(props?.params?.id),
  });

  return { ...query, isLoadingStockByMaterialId };
};

export default useStockByMaterialId;
