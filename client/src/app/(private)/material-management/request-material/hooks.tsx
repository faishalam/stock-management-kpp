"use client";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import IconEye from "@/assets/svg/eye-icon.svg";
import { createContext, useContext, useMemo, useState } from "react";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import useAuth from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import useMaterialListAPI from "@/service/material/useMaterialList";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import useRequestMaterialList from "@/service/request/useRequestList";
import { TRequestMaterialCol, TRequestMaterialList } from "./types";
import { ValueGetterParams } from "@ag-grid-community/core";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import Image from "next/image";
import { TRequestMaterialInput } from "../material-list/types";
import useStatusRequest from "@/service/request/useStatusRequest";
import { toast } from "react-toastify";
import useUpdateRequest from "@/service/request/useUpdateRequest";
import useDeleteRequest from "@/service/request/useDeleteRequest";

const useRequestMaterialHooks = () => {
  const modalWarningInfo = useModalWarningInfo();
  const queryClient = useQueryClient();
  const [modeAdd, setModeAdd] = useState<string>("add");
  const { isLoadingGetUserLoggedIn } = useAuth();
  const [openModalRequest, setOpenModalRequest] = useState<boolean>(false);
  const [requestDetail, setRequestDetail] = useState<TRequestMaterialList>();
  const [openModalQuantity, setOpenModalQuantity] = useState<boolean>(false);
  const [openModalViewRequest, setOpenModalViewRequest] =
    useState<boolean>(false);
  const [openModalRevise, setOpenModalRevise] = useState<boolean>(false);
  const { register, handleSubmit, control, reset, watch } =
    useForm<TRequestMaterialInput>({});

  const { dataUser } = useAuth();

  const {
    reset: resetRequest,
    handleSubmit: handleSubmitRequest,
    control: controleRequest,
  } = useForm<{ quantity: number }>();

  const [filter, setFilter] = useState<{
    search: string;
    satuan: null;
    namaMaterial: string | null;
    areaKerja: string | null;
  }>({
    search: "",
    satuan: null,
    namaMaterial: null,
    areaKerja: null,
  });

  const { data: dataRequestMaterial, isLoading: isLoadingRequestMaterial } =
    useRequestMaterialList({
      params: {
        status: "request",
      },
    });

  const { data: dataMaterialList, isLoading: isLoadingMaterialList } =
    useMaterialListAPI({
      params: {
        page: 1,
      },
    });

  const { mutate: mutateUpdateStatus, isPending: isLoadingStatus } =
    useStatusRequest({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialStockList"] });
        queryClient.refetchQueries({ queryKey: ["useRequestMaterialList"] });
        queryClient.refetchQueries({ queryKey: ["useMaterialList"] });
        toast.success("Success Update Request");
        reset();
        setOpenModalRevise(false);
        setOpenModalViewRequest(false);
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateUpdateRequest, isPending: isLoadingUpdateRequest } =
    useUpdateRequest({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialStockList"] });
        queryClient.refetchQueries({ queryKey: ["useRequestMaterialList"] });
        setOpenModalQuantity(false);
        toast.success("Success Update Request");
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateDeleteRequest, isPending: isLoadingDelete } =
    useDeleteRequest({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialStockList"] });
        queryClient.refetchQueries({ queryKey: ["useRequestMaterialList"] });
        toast.success("Success Delete Request");
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const dataGrid = useMemo(() => {
    const dataFilter = dataRequestMaterial?.filter(
      (x: TRequestMaterialList) => {
        const search1 = x.status
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search2 = x.Material?.materialName
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search3 = x.Material.materialNumber
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search4 = x.User.username
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search5 = x.User.areaKerja
          .toLowerCase()
          .includes(filter.search.toLowerCase());

        const search = search1 || search2 || search3 || search4 || search5;
        const bySatuan = filter.satuan
          ? x.Material.satuan === filter.satuan
          : true;
        const byNamaMaterial = filter?.namaMaterial
          ? x?.Material.materialName === filter?.namaMaterial
          : true;
        const byAreaKerja = filter?.areaKerja
          ? x?.User.areaKerja === filter?.areaKerja
          : true;

        return search && byNamaMaterial && bySatuan && byAreaKerja;
      }
    );
    return dataFilter;
  }, [dataRequestMaterial, filter]);

  const requestMaterialColumnDef = useMemo<TRequestMaterialCol>(() => {
    return [
      {
        width: 90,
        headerName: "No",
        valueGetter: (params: ValueGetterParams<TRequestMaterialList>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "materialName",
        headerName: "Nama Material",
        width: 150,
        flex: 1,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span className="">{params?.data?.Material?.materialName}</span>
        ),
      },
      {
        field: "materialNumber",
        headerName: "Material Number",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span className="">{params?.data?.Material?.materialNumber}</span>
        ),
      },
      {
        field: "quantity",
        headerName: "Request Stock",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span className="">{params?.data?.quantity}</span>
        ),
      },
      {
        field: "satuan",
        headerName: "Satuan",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span>{params?.data?.Material.satuan}</span>
        ),
      },
      {
        field: "request by",
        headerName: "Request By",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span className="italic text-gray-500">
            {params?.data?.User.username}
          </span>
        ),
      },
      {
        field: "areaKerja",
        headerName: "User Area Kerja",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => (
          <span className="">{params?.data?.User.areaKerja}</span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        pinned: "right",
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => {
          return <RenderTransactionStatus status={params.data?.status || ""} />;
        },
      },
      {
        width: 130,
        headerName: "Action",
        pinned: "right",
        sortable: false,
        cellRenderer: (params: ValueGetterParams<TRequestMaterialList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div className="cursor-pointer">
                <Image
                  onClick={() => {
                    if (params?.data) {
                      setRequestDetail(params?.data);
                      setModeAdd("view");
                      setOpenModalViewRequest(true);
                    }
                  }}
                  src={IconEye}
                  alt="view"
                />
              </div>
              {dataUser?.role === "user" &&
                dataUser?.id === params?.data?.User?.id && (
                  <>
                    <div className="cursor-point">
                      <Image
                        onClick={() => {
                          if (params?.data) {
                            setOpenModalQuantity(true);
                            resetRequest(params?.data);
                            setRequestDetail(params?.data);
                            setModeAdd("edit");
                          }
                        }}
                        src={IconPencil}
                        alt="edit"
                      />
                    </div>
                    <div className="cursor-point">
                      <Image
                        onClick={() => {
                          if (params?.data) {
                            modalWarningInfo.open({
                              title: "Confirm Delete",
                              onConfirm: () => {
                                if (!params?.data?.id) return;
                                mutateDeleteRequest(params?.data?.id);
                              },
                              message: (
                                <div>
                                  <p>
                                    Are you sure you want to delete this
                                    Request?
                                  </p>
                                </div>
                              ),
                            });
                          }
                        }}
                        src={DeleteIcon}
                        alt="delete"
                      />
                    </div>
                  </>
                )}
            </div>
          );
        },
      },
    ];
  }, [dataUser?.role]);

  const handleApprove = (id: number) => {
    modalWarningInfo.open({
      title: "Confirm Approved",
      message: (
        <div>
          <p>Are you sure you want to Approve this Request?</p>
        </div>
      ),
      onConfirm: () => {
        mutateUpdateStatus({
          id: id,
          status: "approved",
          reasonRevise: null,
        });
      },
    });
  };

  const onValidSubmitRevise: SubmitHandler<TRequestMaterialInput> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to Rervise this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        if (!requestDetail?.id) return;
        mutateUpdateStatus({
          id: requestDetail?.id ?? 0,
          status: "revised",
          reasonRevise: data?.reasonRevise ?? null,
        });
      },
    });
  };

  const onInvalidSubmitRevise = (
    errors: FieldErrors<TRequestMaterialInput>
  ) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  function useGlobalLoading() {
    return (
      isLoadingRequestMaterial ||
      isLoadingStatus ||
      isLoadingGetUserLoggedIn ||
      isLoadingMaterialList ||
      isLoadingUpdateRequest ||
      isLoadingDelete
    );
  }

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
        count: dataRequestMaterial?.length,
        label: "Total Request",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: dataRequestMaterial?.reduce(
          (total: number, item: TRequestMaterialList) =>
            total + (item.status === "submitted" ? 1 : 0),
          0
        ),
        label: "Status Submitted",
        bgColor: "from-[rgba(220,38,38,0.1)]",
      },
      {
        count: dataRequestMaterial?.reduce(
          (total: number, item: TRequestMaterialList) =>
            total + (item.status === "revised" ? 1 : 0),
          0
        ),
        label: "Status Revised",
        bgColor: "from-[rgba(220,38,38,0.1)]",
      },
    ],
    [dataMaterialList]
  );

  const onInvalidSubmitQuantity = (
    errors: FieldErrors<TRequestMaterialInput>
  ) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  const onValidSubmitQuantity: SubmitHandler<{ quantity: number }> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to Rervise this Stock?</p>
        </div>
      ),
      onConfirm: () => {
        console.log(requestDetail);
        if (!requestDetail?.id) return;
        if (!data?.quantity) return;
        if (data?.quantity > requestDetail?.Material?.totalStock)
          return toast.error("Available stock tidak cukup");
        mutateUpdateRequest({
          id: requestDetail?.id,
          quantity: data?.quantity,
        });
      },
    });
  };
  const areaKerjaOptions = [
    { value: "Parama 1", label: "Parama 1" },
    { value: "Parama 2", label: "Parama 2" },
    { value: "Orion 1", label: "Orion 1" },
    { value: "Orion 2", label: "Orion 2" },
    { value: "Produksi", label: "Produksi" },
    { value: "plant", label: "plant" },
    { value: "TPP", label: "TPP" },
    { value: "Laundry dan HK", label: "Laundry dan HK" },
    { value: "Carpenter", label: "Carpenter" },
    { value: "SM", label: "SM" },
    { value: "Kantin", label: "Kantin" },
    { value: "View Point", label: "View Point" },
    { value: "All", label: "All" },
  ];

  const onDownloadData = (dataRequestMaterial: TRequestMaterialList[]) => {
    try {
      const d = dataRequestMaterial?.map((material: TRequestMaterialList) => {
        return {
          "No. Material": material.Material.materialNumber,
          "Material Name": material.Material.materialName,
          "Request Stock": material.quantity,
          Satuan: material.Material.satuan,
          "Request By": material.User.username,
          "User Area Kerja": material.User.areaKerja,
          Status: material.status,
        };
      });
      const ws = XLSX.utils.json_to_sheet(d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `approval-request-material.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    onDownloadData,
    openModalQuantity,
    areaKerjaOptions,
    onInvalidSubmitQuantity,
    onValidSubmitQuantity,
    setOpenModalQuantity,
    statisticsDataTop,
    dataMaterialList,
    satuanOptions,
    useGlobalLoading,
    onValidSubmitRevise,
    onInvalidSubmitRevise,
    requestDetail,
    setRequestDetail,
    filter,
    requestMaterialColumnDef,
    dataGrid,
    setFilter,
    isLoadingRequestMaterial,
    openModalRequest,
    setOpenModalRequest,
    setModeAdd,
    modeAdd,
    openModalViewRequest,
    setOpenModalViewRequest,
    watch,
    reset,
    setOpenModalRevise,
    resetRequest,
    openModalRevise,
    handleApprove,
    control,
    register,
    handleSubmit,
    handleSubmitRequest,
    controleRequest,
  };
};

const useRequestMaterialContext = createContext<
  ReturnType<typeof useRequestMaterialHooks> | undefined
>(undefined);

export const RequestMaterialProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useRequestMaterialHooks();
  return (
    <useRequestMaterialContext.Provider value={value}>
      {children}
    </useRequestMaterialContext.Provider>
  );
};

export const useRequestMaterial = () => {
  const context = useContext(useRequestMaterialContext);
  if (context === undefined) {
    throw new Error(
      "useRequestMaterialContext must be used within an RequestMaterialProvider"
    );
  }
  return context;
};
export default useRequestMaterial;
