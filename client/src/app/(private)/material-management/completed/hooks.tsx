"use client";
import { createContext, useContext, useMemo, useState } from "react";
import useAuth from "@/app/hooks";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useMaterialListAPI from "@/service/material/useMaterialList";
import { useForm } from "react-hook-form";
import useRequestMaterialList from "@/service/request/useRequestList";
import { ValueGetterParams } from "@ag-grid-community/core";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import { TRequestMaterialInput } from "../material-list/types";
import {
  TRequestMaterialCol,
  TRequestMaterialList,
} from "../request-material/types";
import moment from "moment";

const useRequestMaterialCompletedHooks = () => {
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
        status: "completed",
      },
    });

  const { data: dataMaterialList, isLoading: isLoadingMaterialList } =
    useMaterialListAPI({
      params: {
        page: 1,
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
        field: "updatedAt",
        headerName: "Approved At",
        width: 200,
        valueFormatter: (params: ValueGetterParams<TRequestMaterialList>) => {
          if (!params.data?.createdAt) return "";
          return moment(params.data?.createdAt).format("DD/MM/YYYY");
        },
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
    ];
  }, [dataUser?.role]);

  function useGlobalLoading() {
    return (
      isLoadingRequestMaterial ||
      isLoadingGetUserLoggedIn ||
      isLoadingMaterialList
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
            total + (item.status === "completed" ? item.quantity : 0),
          0
        ),
        label: "Total Stock Completed",
        bgColor: "from-[rgba(220,38,38,0.1)]",
      },
    ],
    [dataMaterialList]
  );

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
      saveAs(data, `completed-material.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    openModalQuantity,
    onDownloadData,
    areaKerjaOptions,
    setOpenModalQuantity,
    statisticsDataTop,
    dataMaterialList,
    satuanOptions,
    useGlobalLoading,
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
    control,
    register,
    handleSubmit,
    handleSubmitRequest,
    controleRequest,
  };
};

const useRequestMaterialCompletedContext = createContext<
  ReturnType<typeof useRequestMaterialCompletedHooks> | undefined
>(undefined);

export const RequestMaterialCompletedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useRequestMaterialCompletedHooks();
  return (
    <useRequestMaterialCompletedContext.Provider value={value}>
      {children}
    </useRequestMaterialCompletedContext.Provider>
  );
};

export const useRequestMaterialCompleted = () => {
  const context = useContext(useRequestMaterialCompletedContext);
  if (context === undefined) {
    throw new Error(
      "useRequestMaterialCompletedContext must be used within an RequestMaterialCompletedProvider"
    );
  }
  return context;
};
export default useRequestMaterialCompleted;
