"use client";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import IconEye from "@/assets/svg/eye-icon.svg";
import { createContext, useContext, useMemo, useState } from "react";
import { ValueGetterParams } from "@ag-grid-community/core";
import Image from "next/image";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import useMaterialStockList from "@/service/stock-material/useMaterialStockList";
import useAuth from "@/app/hooks";
import useMaterialListAPI from "@/service/material/useMaterialList";
import {
  TMasterMaterialStockList,
  TMasterMaterialStockListCol,
  TMaterialStockInput,
} from "../request/types";

const useStockMaterialHooks = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [openModalHarga, setOpenModalHarga] = useState<boolean>(false);
  const [openModalRevise, setOpenModalRevise] = useState<boolean>(false);
  const [openModalStock, setOpenModalStock] = useState<boolean>(false);
  const [modeAdd, setModeAdd] = useState<string>("add");
  const { dataUser } = useAuth();

  const { register, handleSubmit, control, reset, watch } =
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
        status: "completed",
      },
    });

  const [filter, setFilter] = useState<{
    search: string;
    satuan: null;
    namaMaterial: string | null;
  }>({ search: "", satuan: null, namaMaterial: null });

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
        const byNamaMaterial = filter.namaMaterial
          ? x.Material?.materialName === filter.namaMaterial
          : true;

        const search =
          search1 || search2 || search3 || search4 || search5 || search6;
        return search && bySatuan && byNamaMaterial;
      }
    );
    return dataFilter;
  }, [dataMaterialStock, filter]);

  const materialStockColumnDef = useMemo<TMasterMaterialStockListCol>(() => {
    return [
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
        hide: dataUser?.role === "user",
        width: 150,
        valueFormatter: (params: TMasterMaterialStockListCol) =>
          params.value
            ? `Rp ${Number(params.value).toLocaleString("id-ID")}`
            : "Rp 0",
      },
      {
        field: "hargaTotal",
        headerName: "Total Harga",
        hide: dataUser?.role === "user",
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
            </div>
          );
        },
      },
    ];
  }, [dataUser?.role]);

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
        count:
          dataMaterialStock?.filter(
            (item: TMasterMaterialStockList) => item.status === "completed"
          ).length ?? 0,
        label: "Total Completed Stock",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: `Rp ${dataMaterialStock
          ?.reduce(
            (total: number, item: TMasterMaterialStockList) =>
              total + Number(item?.hargaTotal ?? 0),
            0
          )
          .toLocaleString("id-ID")}`,
        label: "Total Harga",
        bgColor: "from-[rgba(147,51,234,0.1)]",
      },
      {
        count: dataMaterialStock?.reduce(
          (total: number, item: TMasterMaterialStockList) =>
            total + Number(item?.quantity ?? 0),
          0
        ),
        label: "Total Quantity",
        bgColor: "from-[rgba(249,115,22,0.1)]",
      },
    ],
    [dataMaterialStock, dataMaterialList]
  );

  function useGlobalLoading() {
    return isLoadingMaterialStock || isLoadingMaterialList;
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
      saveAs(data, `available-completed-stock.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    useGlobalLoading,
    statisticsDataTop,
    satuanOptions,
    materialStockColumnDef,
    isLoadingMaterialStock,
    register,
    handleSubmit,
    control,
    reset,
    mode,
    openModalStock,
    dataMaterialList,
    setOpenModalStock,
    modeAdd,
    setModeAdd,
    openModalRevise,
    setOpenModalRevise,
    watch,
    filter,
    setFilter,
    dataGrid,
    onDownloadData,
    openModalHarga,
    setOpenModalHarga,
  };
};

const useStockMaterialContext = createContext<
  ReturnType<typeof useStockMaterialHooks> | undefined
>(undefined);

export const StockMaterialProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useStockMaterialHooks();
  return (
    <useStockMaterialContext.Provider value={value}>
      {children}
    </useStockMaterialContext.Provider>
  );
};

export const useStockMaterial = () => {
  const context = useContext(useStockMaterialContext);
  if (context === undefined) {
    throw new Error(
      "useStockMaterialContext must be used within an StockMaterialProvider"
    );
  }
  return context;
};
export default useStockMaterial;
