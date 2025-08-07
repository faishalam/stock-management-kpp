"use client";
import moment from "moment";
import { createContext, useContext, useMemo, useState } from "react";
import { ValueGetterParams } from "@ag-grid-community/core";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useMaterialListById from "@/service/material/useMaterialById";
import { TMasterMaterialCol, TMaterialFormInput } from "../types";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import useStockByMaterialId from "@/service/stock-material/useStockByMaterialId";
import { TMasterMaterialStockList } from "@/app/(private)/stock-management/request/types";
import useAuth from "@/app/hooks";

const useMaterialListDetail = () => {
  const [openModalStock, setOpenModalStock] = useState<boolean>(false);
  const [modeAdd, setModeAdd] = useState<string>("add");
  const { id } = useParams();
  const { dataUser } = useAuth();

  const { control } = useForm<TMaterialFormInput>({
    defaultValues: {
      materialNumber: null,
      materialName: "",
      satuan: "",
    },
  });

  const { data: dataMaterialById, isLoading: isLoadingMaterialListById } =
    useMaterialListById({
      params: {
        id: Number(id),
      },
    });

  const { data: dataStockByMaterialId, isLoading: isLoadingStockByMaterialId } =
    useStockByMaterialId({
      params: {
        id: Number(dataMaterialById?.id),
      },
    });

  const [filter, setFilter] = useState<{
    search: string;
    satuan: null;
    status: null | string;
    cutoff_from: string | null;
    cutoff_to: string | null;
  }>({
    search: "",
    satuan: null,
    status: null,
    cutoff_from: null,
    cutoff_to: null,
  });

  const dataGrid = useMemo(() => {
    const dataFilter = dataStockByMaterialId?.filter(
      (x: TMasterMaterialStockList) => {
        const search1 = x?.quantity
          .toString()
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search2 = x.status
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search3 = x.hargaTotal
          ?.toString()
          .toLowerCase()
          .includes(filter.search.toLowerCase());
        const search = search1 || search2 || search3;
        const byStatus = filter.status ? x.status === filter.status : true;

        let isCutoffInRange = true;
        if (x.createdAt) {
          const createdDate = new Date(x.createdAt)
            .toISOString()
            .substring(0, 10);

          isCutoffInRange =
            (!filter.cutoff_from || createdDate >= filter.cutoff_from) &&
            (!filter.cutoff_to || createdDate <= filter.cutoff_to);
        }

        return search && byStatus && isCutoffInRange;
      }
    );
    return dataFilter;
  }, [dataStockByMaterialId, filter]);

  const stockListColumnDef = useMemo<TMasterMaterialCol>(() => {
    return [
      {
        width: 90,
        headerName: "No",
        valueGetter: (params: ValueGetterParams<TMasterMaterialStockList>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "createdAt",
        headerName: "Submitted Date",
        width: 200,
        valueFormatter: (
          params: ValueGetterParams<TMasterMaterialStockList>
        ) => {
          if (!params.data?.createdAt) return "";
          return moment(params.data?.createdAt).format("DD/MM/YYYY");
        },
      },
      {
        headerName: "Nama Material",
        width: 150,
        flex: 1,
        cellRenderer: () => <span>{dataMaterialById?.materialName}</span>,
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => (
          <span>
            {params?.data?.quantity} {dataMaterialById?.satuan}
          </span>
        ),
      },
      {
        field: "hargaSatuan",
        headerName: "Harga per Satuan",
        hide: dataUser?.role === "user",
        width: 150,
        valueFormatter: (params: TMasterMaterialCol) =>
          params.value
            ? `Rp ${Number(params.value).toLocaleString("id-ID")}`
            : "Rp 0",
      },
      {
        field: "hargaTotal",
        headerName: "Total Harga",
        hide: dataUser?.role === "user",
        width: 150,
        valueFormatter: (params: TMasterMaterialCol) =>
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
        field: "status",
        headerName: "Status",
        width: 150,
        pinned: "right",
        cellRenderer: (params: ValueGetterParams<TMasterMaterialStockList>) => {
          return <RenderTransactionStatus status={params.data?.status || ""} />;
        },
      },
    ];
  }, [dataStockByMaterialId]);

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
        count: dataMaterialById?.Stocks.length,
        label: "Total Request Stock",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: `${dataMaterialById?.Stocks.reduce(
          (total: number, item: TMasterMaterialStockList) =>
            item.status === "submitted" || item.status === "approved"
              ? total + (item.quantity ?? 0)
              : total,
          0
        )} ${dataMaterialById?.satuan}`,
        label: "Quantity Waiting for Approval",
        bgColor: "from-[rgba(250,204,21,0.1)]",
      },
      {
        count: `${dataMaterialById?.Stocks.reduce(
          (total: number, item: TMasterMaterialStockList) =>
            item.status === "revised" ? total + (item.quantity ?? 0) : total,
          0
        )} ${dataMaterialById?.satuan}`,
        label: "Quantity Revised",
        bgColor: "from-[rgba(22,163,74,0.1)]",
      },
      {
        count: `${dataMaterialById?.totalStock}`,
        label: "Available Stock",
        bgColor: "from-[rgba(220,38,38,0.1)]",
      },
    ],
    [dataMaterialById]
  );

  function useGlobalLoading() {
    return isLoadingMaterialListById || isLoadingStockByMaterialId;
  }

  const onDownloadData = (
    dataStockByMaterialId: TMasterMaterialStockList[]
  ) => {
    try {
      const d = dataStockByMaterialId?.map(
        (material: TMasterMaterialStockList) => {
          return {
            "Material Name": dataMaterialById.materialName,
            Quantity: dataMaterialById.quantity,
            "Harga per Satuan": material.hargaSatuan,
            "Total Harga": material.hargaTotal,
            "Submitted By": material.User.username,
            "Submitted Date": moment(material.createdAt).format("DD/MM/YYYY"),
            Status: material.status,
          };
        }
      );
      const ws = XLSX.utils.json_to_sheet(d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `material-list-all.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    statisticsDataTop,
    onDownloadData,
    filter,
    stockListColumnDef,
    dataGrid,
    control,
    setFilter,
    openModalStock,
    setOpenModalStock,
    satuanOptions,
    setModeAdd,
    modeAdd,
    dataMaterialById,
    isLoadingMaterialListById,
    useGlobalLoading,
  };
};

const useMaterialDetailContext = createContext<
  ReturnType<typeof useMaterialListDetail> | undefined
>(undefined);

export const MaterialListDetailProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useMaterialListDetail();
  return (
    <useMaterialDetailContext.Provider value={value}>
      {children}
    </useMaterialDetailContext.Provider>
  );
};

export const useMaterialDetail = () => {
  const context = useContext(useMaterialDetailContext);
  if (context === undefined) {
    throw new Error(
      "useMaterialDetailContext must be used within an MaterialListDetailProvider"
    );
  }
  return context;
};
export default useMaterialDetail;
