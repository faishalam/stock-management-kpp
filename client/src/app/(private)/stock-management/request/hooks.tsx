"use client";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import IconEye from "@/assets/svg/eye-icon.svg";
import { createContext, useContext, useMemo, useState } from "react";
import { ValueGetterParams } from "@ag-grid-community/core";
import Image from "next/image";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import {
  TMasterMaterialStockList,
  TMasterMaterialStockListCol,
  TMaterialStockInput,
} from "./types";
import useAddStock from "@/service/stock-material/useAddStock";
import useEditStock from "@/service/stock-material/useEditStock";
import useMaterialStockList from "@/service/stock-material/useMaterialStockList";
import useAuth from "@/app/hooks";
import { Radio } from "@mui/material";
import useDeleteMaterialStock from "@/service/stock-material/useDeleteStock";
import useStatusStock from "@/service/stock-material/useStatusStock";
import useUpdateHargaStock from "@/service/stock-material/useUpdatePrice";
import useMaterialListAPI from "@/service/material/useMaterialList";
import { toast } from "react-toastify";

const useRequestMaterialHooks = () => {
  const modalWarningInfo = useModalWarningInfo();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const queryClient = useQueryClient();
  const [openModalHarga, setOpenModalHarga] = useState<boolean>(false);
  const [openModalRevise, setOpenModalRevise] = useState<boolean>(false);
  const [openModalStock, setOpenModalStock] = useState<boolean>(false);
  const [modeAdd, setModeAdd] = useState<string>("add");
  const { dataUser } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>();

  const { register, handleSubmit, control, reset, watch, getValues, setValue } =
    useForm<TMaterialStockInput>({
      defaultValues: {
        materialId: null,
        quantity: null,
        hargaSatuan: null,
        hargaTotal: null,
        status: null,
        reasonRevise: null,
      },
    });

  const { data: dataMaterialList, isLoading: isLoadingMaterialList } =
    useMaterialListAPI({
      params: {
        page: 1,
      },
    });

  const { data: dataMaterialStock, isLoading: isLoadingMaterialStock } =
    useMaterialStockList({
      params: {
        status: "request",
      },
    });

  const { mutate: mutateAddStock, isPending: isLoadingAddStock } = useAddStock({
    onSuccess: () => {
      toast.success("Success Add Material Stock");
      reset();
      setOpenModalStock(false);
      queryClient.refetchQueries({
        queryKey: ["useMaterialStockList"],
      });
    },
    onError: (error: unknown) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateEditStock, isPending: isLoadingEditStock } =
    useEditStock({
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["useMaterialStockList"],
        });
        toast.success("Success Update Material Stock");
        reset();
        setOpenModalStock(false);
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const {
    mutate: mutateUpdateHargaStock,
    isPending: isLoadingUpdateHargaStock,
  } = useUpdateHargaStock({
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["useMaterialStockList"],
      });
      toast.success("Success Update Harga Stock");
      reset();
      setOpenModalStock(false);
      setOpenModalHarga(false);
    },
    onError: (error: unknown) => {
      toast.error(error as string);
    },
  });

  const {
    mutate: mutateDeleteMaterialStock,
    isPending: isLoadingDeleteMaterialStock,
  } = useDeleteMaterialStock({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useMaterialStockList"] });
      toast.success("Success Delete Material Stock");
    },
    onError: (error: unknown) => {
      toast.error(error as string);
    },
  });

  const { mutate: mutateUpdateStatus, isPending: isLoadingStatusStock } =
    useStatusStock({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialStockList"] });
        queryClient.refetchQueries({ queryKey: ["useMaterialList"] });
        toast.success("Success Update Material Stock");
        reset();
        setOpenModalRevise(false);
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const [filter, setFilter] = useState<{
    search: string;
    satuan: null;
    status: string | null;
    namaMaterial: string | null;
  }>({ search: "", satuan: null, status: null, namaMaterial: null });

  const dataGrid = useMemo(() => {
    const dataFilter = dataMaterialStock?.filter(
      (x: TMasterMaterialStockList) => {
        const search1 = x.Material?.materialName
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search2 = x.Material?.satuan
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search3 = x.User?.username
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search4 = x.Material?.materialNumber
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search5 = x.status
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search6 = x?.hargaTotal
          ?.toString()
          .toLowerCase()
          .includes(filter.search.toLowerCase());

        const bySatuan = filter.satuan
          ? x.Material.satuan === filter.satuan
          : true;
        const byStatus = filter.status ? x.status === filter.status : true;
        const byNamaMaterial = filter?.namaMaterial
          ? x.Material?.materialName === filter?.namaMaterial
          : true;

        const search =
          search1 || search2 || search3 || search4 || search5 || search6;
        return search && bySatuan && byStatus && byNamaMaterial;
      }
    );
    return dataFilter;
  }, [dataMaterialStock, filter]);

  const onValidSubmit: SubmitHandler<TMaterialStockInput> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to save this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        if (modeAdd === "add") {
          mutateAddStock(data);
        } else if (modeAdd === "edit") {
          if (!data?.id) return;
          if (dataUser?.role === "admin") {
            mutateEditStock(data);
          }
          if (
            dataUser?.role === "supervisor_1" ||
            dataUser?.role === "supervisor_2"
          ) {
            mutateUpdateHargaStock(data);
          }
        }
      },
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<TMaterialStockInput>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  const onValidSubmitHarga: SubmitHandler<TMaterialStockInput> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to save this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        mutateUpdateHargaStock(data);
      },
    });
  };

  const onInvalidSubmitHarga = (errors: FieldErrors<TMaterialStockInput>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  const onValidSubmitRevise: SubmitHandler<TMaterialStockInput> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to Rervise this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        mutateUpdateStatus({
          id: selectedId ?? 0,
          status: "revised",
          reasonRevise: data?.reasonRevise ?? null,
        });
      },
    });
  };

  const onInvalidSubmitRevise = (errors: FieldErrors<TMaterialStockInput>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  const handleApprove = (selectedId: number) => {
    modalWarningInfo.open({
      title: "Confirm Approved",
      message: (
        <div>
          <p>Are you sure you want to Approve this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        const status =
          dataUser?.role === "supervisor_1" ? "approved" : "completed";
        mutateUpdateStatus({
          id: selectedId,
          status: status,
          reasonRevise: null,
        });
      },
    });
  };

  const materialStockColumnDef = useMemo<TMasterMaterialStockListCol>(() => {
    return [
      {
        width: 80,
        pinned: "left",
        hide: dataUser?.role === "admin" || dataUser?.role === "user",
        sortable: false,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => {
          const itemId = params?.data?.id;
          if (!itemId) return null;

          const isVisible =
            (params?.data?.status === "submitted" &&
              dataUser?.role === "supervisor_1") ||
            (params?.data?.status === "approved" &&
              dataUser?.role === "supervisor_2");

          if (!isVisible) return null;

          return (
            <div>
              <Radio
                checked={selectedId === itemId}
                onChange={() => {
                  setSelectedId((prev) => (prev === itemId ? null : itemId));
                }}
              />
            </div>
          );
        },
      },

      {
        width: 90,
        headerName: "No",
        pinned: "left",
        valueGetter: (params: ValueGetterParams<TMasterMaterialStockList>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "materialNumber",
        width: 150,
        headerName: "Material Number",
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span>{params?.data?.Material?.materialNumber}</span>
        ),
      },
      {
        field: "materialName",
        headerName: "Nama Meterial",
        width: 300,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span>{params?.data?.Material?.materialName}</span>
        ),
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span>{params?.data?.quantity}</span>
        ),
      },
      {
        field: "satuan",
        headerName: "Satuan",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span>{params?.data?.Material?.satuan}</span>
        ),
      },
      {
        field: "hargaSatuan",
        headerName: "Harga per Satuan",
        width: 150,
        valueFormatter: (params: TMasterMaterialStockListCol) =>
          params.value
            ? `Rp ${Number(params.value).toLocaleString("id-ID")}`
            : "Rp 0",
      },
      {
        field: "hargaTotal",
        headerName: "Total Harga",
        width: 150,
        valueFormatter: (params: TMasterMaterialStockListCol) =>
          params.value
            ? `Rp ${Number(params.value).toLocaleString("id-ID")}`
            : "Rp 0",
      },
      {
        field: "user",
        headerName: "Submitted By",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span className="italic text-gray-500">
            {params?.data?.User?.username}
          </span>
        ),
      },
      {
        field: "createdAt",
        headerName: "Submitted Date",
        width: 200,
        valueFormatter: (
          params: ValueGetterParams<TMasterMaterialStockListCol>
        ) => {
          if (!params.data?.createdAt) return "";
          return moment(params.data?.createdAt).format("DD/MM/YYYY");
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        pinned: "right",
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => {
          return <RenderTransactionStatus status={params.data?.status || ""} />;
        },
      },
      {
        width: 130,
        headerName: "Action",
        pinned: "right",
        sortable: false,
        cellRenderer: (
          params: ValueGetterParams<TMasterMaterialStockListCol>
        ) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div className="cursor-pointer">
                <Image
                  onClick={() => {
                    if (params?.data) {
                      reset(params?.data);
                      setModeAdd("view");
                      setOpenModalStock(true);
                    }
                  }}
                  src={IconEye}
                  alt="view"
                />
              </div>
              {dataUser?.role !== "user" && (
                <div className="cursor-point">
                  <Image
                    onClick={() => {
                      if (params?.data) {
                        reset(params?.data);
                        setModeAdd("edit");
                        setOpenModalStock(true);
                      }
                    }}
                    src={IconPencil}
                    alt="edit"
                  />
                </div>
              )}

              {dataUser?.role === "admin" && (
                <div className="cursor-point">
                  <Image
                    onClick={() => {
                      if (params?.data) {
                        modalWarningInfo.open({
                          title: "Confirm Delete",
                          onConfirm: () => {
                            if (!params?.data?.id) return;
                            mutateDeleteMaterialStock(params?.data?.id);
                          },
                          message: (
                            <div>
                              <p>Are you sure you want to delete this Stock?</p>
                            </div>
                          ),
                        });
                      }
                    }}
                    src={DeleteIcon}
                    alt="delete"
                  />
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [dataUser?.role, selectedId]);

  const satuanOptions = [
    {
      value: "ikat",
      label: "Ikat",
    },
    {
      value: "pcs",
      label: "Pcs",
    },
    {
      value: "bungkus",
      label: "Bungkus",
    },
    {
      value: "rak",
      label: "Rak",
    },
    {
      value: "liter",
      label: "Lilter",
    },
    {
      value: "kg",
      label: "Kg",
    },
  ];

  const statisticsDataTop = useMemo(
    () => [
      {
        count: dataMaterialStock?.length,
        label: "Total Request Stock Material",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: dataMaterialList?.length,
        label: "Total Raw Material",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      // {
      //   count: `Rp ${dataMaterialStock
      //     ?.reduce(
      //       (total: number, item: TMasterMaterialStockList) =>
      //         total + Number(item?.harga ?? 0),
      //       0
      //     )
      //     .toLocaleString("id-ID")}`,
      //   label: "Total Harga",
      //   bgColor: "from-[rgba(147,51,234,0.1)]",
      // },
      // {
      //   count: dataMaterialStock?.reduce(
      //     (total: number, item: TMasterMaterialStockList) =>
      //       total + Number(item?.quantity ?? 0),
      //     0
      //   ),
      //   label: "Total Quantity",
      //   bgColor: "from-[rgba(249,115,22,0.1)]",
      // },
    ],
    [dataMaterialStock, dataMaterialList]
  );

  const statisticsDataBottom = useMemo(
    () => [
      {
        count:
          dataMaterialStock?.filter(
            (item: TMasterMaterialStockList) => item.status === "submitted"
          ).length ?? 0,
        label: "Stocks Submitted",
        bgColor: "bg-[#f3e8ff] text-[#8d52bd]",
      },
      {
        count:
          dataMaterialStock?.filter(
            (item: TMasterMaterialStockList) => item.status === "revised"
          ).length ?? 0,
        label: "Stocks Revised",
        bgColor: "bg-[#FEF9C3] text-[#854D0E]",
      },
      {
        count:
          dataMaterialStock?.filter(
            (item: TMasterMaterialStockList) => item.status === "completed"
          ).length ?? 0,
        label: "Stocks Completed",
        bgColor: "bg-[#dcfce7] text-[#156534]",
      },
    ],
    [dataMaterialStock]
  );

  function useGlobalLoading() {
    return (
      isLoadingMaterialList ||
      isLoadingAddStock ||
      isLoadingEditStock ||
      isLoadingUpdateHargaStock ||
      isLoadingDeleteMaterialStock ||
      isLoadingStatusStock
    );
  }

  const onDownloadData = (dataMaterialStock: TMasterMaterialStockList[]) => {
    try {
      const d = dataMaterialStock?.map((material: TMasterMaterialStockList) => {
        return {
          "No. Material": material.Material.materialNumber,
          "Material Name": material.Material.materialName,
          Quantity: material.quantity,
          Satuan: material.Material.satuan,
          "Harga per Satuan": material.hargaSatuan,
          "Total Harga": material.hargaTotal,
          "Submitted By": material.User.username,
          "Submitted Date": moment(material.createdAt).format("DD/MM/YYYY"),
          "Status" : material.status
        };
      });
      const ws = XLSX.utils.json_to_sheet(d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `input-approval-stock.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    useGlobalLoading,
    statisticsDataBottom,
    statisticsDataTop,
    satuanOptions,
    materialStockColumnDef,
    isLoadingMaterialStock,
    onValidSubmit,
    onInvalidSubmit,
    register,
    handleSubmit,
    control,
    reset,
    mode,
    openModalStock,
    setOpenModalStock,
    modeAdd,
    setModeAdd,
    openModalRevise,
    setOpenModalRevise,
    dataMaterialList,
    watch,
    filter,
    setFilter,
    dataGrid,
    selectedId,
    handleApprove,
    openModalHarga,
    setOpenModalHarga,
    onInvalidSubmitHarga,
    onValidSubmitHarga,
    onValidSubmitRevise,
    onInvalidSubmitRevise,
    getValues,
    setValue,
    onDownloadData
  };
};

const useMaterialContext = createContext<
  ReturnType<typeof useRequestMaterialHooks> | undefined
>(undefined);

export const MaterialProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useRequestMaterialHooks();
  return (
    <useMaterialContext.Provider value={value}>
      {children}
    </useMaterialContext.Provider>
  );
};

export const useMaterial = () => {
  const context = useContext(useMaterialContext);
  if (context === undefined) {
    throw new Error(
      "useMaterialContext must be used within an MaterialProvider"
    );
  }
  return context;
};
export default useMaterial;
