import { useQuery } from "@tanstack/react-query";
import { NetworkAPIError } from "@/utils/response-type";
import { AxiosError } from "axios";
import { HeroServices } from "../HeroService";

type TuseMaterialStockListProps = {
  onSuccess?: (data: string) => void;
  onError?: (error: unknown) => void;
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
    year: number;
  };
};

const useMaterialStockList = (props?: TuseMaterialStockListProps) => {
  const useMaterialStockListFn = async () => {
    try {
      const response = await HeroServices.get(`/stock/trend`, {
        params: {
          ...(props?.params?.year && { year: props.params.year }),
        },
      });

      const { status } = response;

      if (status !== 200) return;

      return response?.data.data;
    } catch (error) {
      const err = error as AxiosError<NetworkAPIError>;
      throw err?.response;
    }
  };

  const query = useQuery({
    queryKey: ["useMaterialStockList", props?.params],
    queryFn: useMaterialStockListFn,
    staleTime: Infinity,
    enabled: Boolean(props?.params?.year),
  });

  return { ...query };
};

export default useMaterialStockList;
