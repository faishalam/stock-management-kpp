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
import useAuth from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import {
  TMasterMaterialCol,
  TMasterMaterialList,
  TMaterialFormInput,
  TRequestMaterialInput,
} from "./types";
import useDeleteMaterial from "@/service/material/useDeleteMaterial";
import useUpdateMaterial from "@/service/material/useUpdateMaterial";
import useMaterialListById from "@/service/material/useMaterialById";
import useAddMaterial from "@/service/material/useAddMaterial";
import useMaterialListAPI from "@/service/material/useMaterialList";
import { Radio } from "@mui/material";
import useAddRequest from "@/service/request/useAddRequest";

const useMaterialListHooks = () => {
  const router = useRouter();
  const modalWarningInfo = useModalWarningInfo();
  const queryClient = useQueryClient();
  const [modeAdd, setModeAdd] = useState<string>("add");
  const { id } = useParams();
  const [openModalStock, setOpenModalStock] = useState<boolean>(false);
  const { dataUser, isLoadingGetUserLoggedIn } = useAuth();
  const [openModalQuantity, setOpenModalQuantity] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>();

  const [filter, setFilter] = useState<{
    search: string;
    satuan: null;
    cutoff_from: string | null;
    cutoff_to: string | null;
    namaMaterial: string | null;
  }>({
    search: "",
    satuan: null,
    cutoff_from: null,
    cutoff_to: null,
    namaMaterial: null,
  });

  const { register, handleSubmit, control, reset } =
    useForm<TMaterialFormInput>({
      defaultValues: {
        materialNumber: null,
        materialName: "",
        satuan: "",
      },
    });

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    control: controleRequest,
    reset: resetRequest,
  } = useForm<TRequestMaterialInput>({
    defaultValues: {
      materialId: null,
      quantity: null,
    },
  });

  const { data: dataMaterialList, isLoading: isLoadingMaterialList } =
    useMaterialListAPI({
      params: {
        page: 1,
      },
    });

  const { data: dataMaterialById, isLoading: isLoadingMaterialListById } =
    useMaterialListById({
      params: {
        id: Number(id),
      },
    });

  const { mutate: mutateAddMaterial, isPending: isLoadingAddMaterial } =
    useAddMaterial({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialList"] });
        toast.success("Success Add Material Stock");
        setOpenModalStock(false);
        reset();
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateAddRequest, isPending: isLoadingAddRequest } =
    useAddRequest({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useRequestMaterialList"] });
        router.push("/material-management/request-material");
        toast.success("Success Add Request");
        setOpenModalQuantity(false);
        resetRequest();
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateEditMaterial, isPending: isLoadingUpdateMaterial } =
    useUpdateMaterial({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialList"] });
        queryClient.refetchQueries({
          queryKey: ["useMaterialStockList"],
        });
        toast.success("Success Update Material");
        setOpenModalStock(false);
        reset();
      },

      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateDeleteMaterial, isPending: isLoadingDeleteMaterial } =
    useDeleteMaterial({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useMaterialList"] });
        queryClient.refetchQueries({
          queryKey: ["useMaterialStockList"],
        });
        toast.success("Delete Asset Successfully");
      },
      onError: (errorDeleteAsset: unknown) => {
        toast.error(errorDeleteAsset as string);
      },
    });

  const onValidSubmit: SubmitHandler<TMaterialFormInput> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to save this Material Stock?</p>
        </div>
      ),
      onConfirm: () => {
        if (modeAdd === "add") {
          mutateAddMaterial(data);
        } else if (modeAdd === "edit") {
          if (!data?.id) return;
          mutateEditMaterial(data);
        }
      },
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<TMaterialFormInput>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        console.log(error?.message);
        toast.error(error.message);
      }
    });
  };

  const onValidSubmitQuantity: SubmitHandler<TRequestMaterialInput> = (
    data
  ) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to save this Request?</p>
        </div>
      ),
      onConfirm: () => {
        if (modeAdd === "add") {
          if (!selectedId) return;
          const findMaterial = dataMaterialList?.find(
            (item: TMasterMaterialList) => item.id === selectedId
          );

          if (!findMaterial) return toast.error("Material tidak ditemukan");
          if (!data?.quantity) return;
          if (findMaterial?.totalStock < data?.quantity)
            return toast.error("Available stock tidak cukup");
          if (data?.quantity > findMaterial.limited)
            return toast.error(
              `Request hanya dapat ${findMaterial.limited} ${findMaterial.satuan}`
            );
          mutateAddRequest({
            materialId: selectedId,
            quantity: data?.quantity,
          });
        }
      },
    });
  };

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

  const dataGrid = useMemo(() => {
    const dataFilter = dataMaterialList?.filter((x: TMasterMaterialList) => {
      const search1 = x.materialName
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search2 = x.satuan
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search3 = x.User?.username
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search4 = x.materialNumber
        .toLowerCase()
        .includes(filter.search.toLowerCase());

      const search = search1 || search2 || search3 || search4;
      const bySatuan = filter.satuan ? x.satuan === filter.satuan : true;
      const byNamaMaterial = filter?.namaMaterial
        ? x?.materialName === filter?.namaMaterial
        : true;

      let isCutoffInRange = true;
      if (x.createdAt) {
        const createdDate =
          x.createdAt instanceof Date
            ? x.createdAt.toISOString().substring(0, 10)
            : new Date(x.createdAt).toISOString().substring(0, 10);

        isCutoffInRange =
          (!filter.cutoff_from ||
            filter.cutoff_from === "" ||
            createdDate >= filter.cutoff_from) &&
          (!filter.cutoff_to ||
            filter.cutoff_to === "" ||
            createdDate <= filter.cutoff_to);
      }

      return search && bySatuan && isCutoffInRange && byNamaMaterial;
    });
    return dataFilter;
  }, [dataMaterialList, filter]);

  const stockListColumnDef = useMemo<TMasterMaterialCol>(() => {
    return [
      {
        width: 80,
        pinned: "left",
        hide:
          dataUser?.role === "admin" ||
          dataUser?.role === "supervisor_1" ||
          dataUser?.role === "supervisor_2",
        sortable: false,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialList>) => {
          const itemId = params?.data?.id;
          if (!itemId) return null;

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
        valueGetter: (params: ValueGetterParams<TMasterMaterialList>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "materialNumber",
        width: 150,
        headerName: "Material Number",
      },
      {
        field: "materialName",
        flex: 1,
        headerName: "Nama Meterial",
        width: 300,
      },
      {
        field: "satuan",
        headerName: "Satuan",
        width: 150,
      },
      {
        field: "totalStock",
        headerName: "Available Stock",
        width: 150,
      },
      {
        field: "limited",
        headerName: "Limited Request",
        width: 150,
      },
      {
        field: "user",
        headerName: "Submitted By",
        width: 150,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialList>) => (
          <span className="italic text-gray-500">
            {params?.data?.User?.username}
          </span>
        ),
      },
      {
        field: "createdAt",
        headerName: "Submitted Date",
        width: 200,
        valueFormatter: (params: ValueGetterParams<TMasterMaterialList>) => {
          if (!params.data?.createdAt) return "";
          return moment(params.data?.createdAt).format("DD/MM/YYYY");
        },
      },
      {
        width: 130,
        headerName: "Action",
        pinned: "right",
        sortable: false,
        cellRenderer: (params: ValueGetterParams<TMasterMaterialList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div className="cursor-pointer">
                <Image
                  onClick={() => {
                    if (params?.data) {
                      router.push(
                        `/material-management/material-list/${params?.data?.id}?mode=view`
                      );
                    }
                  }}
                  src={IconEye}
                  alt="view"
                />
              </div>
              {dataUser?.role === "admin" && (
                <>
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
                  <div className="cursor-point">
                    <Image
                      onClick={() => {
                        if (params?.data) {
                          modalWarningInfo.open({
                            title: "Confirm Delete",
                            onConfirm: () => {
                              if (!params?.data?.id) return;
                              mutateDeleteMaterial(params?.data?.id);
                            },
                            message: (
                              <div>
                                <p>
                                  Are you sure you want to delete this Material?
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
  }, [selectedId, dataUser?.role]);

  function useGlobalLoading() {
    return (
      isLoadingMaterialListById ||
      isLoadingAddMaterial ||
      isLoadingUpdateMaterial ||
      isLoadingDeleteMaterial ||
      isLoadingGetUserLoggedIn ||
      isLoadingAddRequest
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
        count: dataMaterialList?.length,
        label: "Total Materials",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: dataMaterialList?.map((item: TMasterMaterialList) => item.satuan)
          .length,
        label: "Stocks Submitted",
        bgColor: "from-[rgba(220,38,38,0.1)]",
      },
    ],
    [dataMaterialList]
  );

  const onDownloadData = (dataMaterialList: TMasterMaterialList[]) => {
    try {
      const d = dataMaterialList?.map((material: TMasterMaterialList) => {
        return {
          "No. Material": material.materialNumber,
          "Material Name": material.materialName,
          "Satuan": material.satuan,
          "Available Stock": material.totalStock,
          "Limited Request": material.limited,
          "Submitted By": material.User?.username,
          "Submitted Date": moment(material.createdAt).format("DD/MM/YYYY"),
        };
      });
      const ws = XLSX.utils.json_to_sheet(d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `raw-material.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    filter,
    onDownloadData,
    statisticsDataTop,
    isLoadingMaterialList,
    isLoadingMaterialListById,
    isLoadingAddMaterial,
    isLoadingUpdateMaterial,
    isLoadingDeleteMaterial,
    isLoadingGetUserLoggedIn,
    dataMaterialList,
    stockListColumnDef,
    dataGrid,
    setFilter,
    openModalStock,
    setOpenModalStock,
    onInvalidSubmit,
    onValidSubmit,
    handleSubmit,
    register,
    control,
    reset,
    satuanOptions,
    setModeAdd,
    modeAdd,
    dataMaterialById,
    useGlobalLoading,
    registerRequest,
    controleRequest,
    resetRequest,
    handleSubmitRequest,
    openModalQuantity,
    setOpenModalQuantity,
    onInvalidSubmitQuantity,
    onValidSubmitQuantity,
    selectedId,
  };
};

const useMaterialListContext = createContext<
  ReturnType<typeof useMaterialListHooks> | undefined
>(undefined);

export const MaterialListProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useMaterialListHooks();
  return (
    <useMaterialListContext.Provider value={value}>
      {children}
    </useMaterialListContext.Provider>
  );
};

export const useMaterialList = () => {
  const context = useContext(useMaterialListContext);
  if (context === undefined) {
    throw new Error(
      "useMaterialListContext must be used within an MaterialListProvider"
    );
  }
  return context;
};
export default useMaterialList;
