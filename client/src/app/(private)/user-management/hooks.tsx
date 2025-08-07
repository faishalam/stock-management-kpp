"use client";
import IconPencil from "@/assets/svg/icon-pencil.svg";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DeleteIcon from "@/assets/svg/delete-icon.svg";
import IconEye from "@/assets/svg/eye-icon.svg";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, createContext, useState, useMemo, useEffect } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { ValueGetterParams } from "@ag-grid-community/core";
import Image from "next/image";
import useUserList from "@/service/user/useUserList";
import { toast } from "react-toastify";
import {
  InputsRegister,
  TMasterResponse,
  TMasterUserCol,
  TMasterUserList,
} from "./types";
import useRegister from "@/service/user/register";
import { useModalWarningInfo } from "@/components/atoms/modal-warning";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteUser from "@/service/user/useDeleteUser";
import useUpdateUser from "@/service/user/useUpdateUser";
import useUserById from "@/service/user/useUserById";

const useUserManagementHooks = () => {
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    reset: resetRegister,
    resetField,
    getValues: getValuesRegister,
    control: controlRegister,
  } = useForm<InputsRegister>({
    defaultValues: {
      email: "",
      old_password: "",
      password: "",
      username: "",
      role: "",
      areaKerja: "",
    },
  });
  const { id } = useParams();
  const router = useRouter();
  const [searchUser, setSearchUser] = useState<string>("");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [filter, setFilter] = useState<{
    search: string;
    role: string | null;
    areaKerja: string | null;
  }>({ search: "", role: null, areaKerja: null });
  const [pagination, setPagination] = useState<{ page: number; limit: number }>(
    { page: 1, limit: 10 }
  );
  const modalWarningInfo = useModalWarningInfo();
  const queryClient = useQueryClient();

  const { data: dataUserList, isLoading: isLoadingGetUserList } = useUserList({
    params: {
      search: undefined,
      page: pagination?.page || 1,
      limit: pagination?.limit || 13,
    },
  });

  const dataGrid = useMemo(() => {
    const dataFilter = dataUserList?.data?.filter((x: TMasterUserList) => {
      const search1 = x.username
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search2 = x.email
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search3 = x.role
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search4 = x.areaKerja
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const search = search1 || search2 || search3 || search4;

      const byRoles = filter.role ? x.role === filter.role : true;
      const byAreaKerja = filter?.areaKerja
        ? x.areaKerja === filter?.areaKerja
        : true;
      return search && byRoles && byAreaKerja;
    });
    return dataFilter;
  }, [dataUserList, filter]);

  const { mutate: mutateRegister, isPending: isLoadingAddUser } = useRegister({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["useUserList"] });
      router.push("/user-management");
      toast.success("Created user successfully");
      resetRegister();
    },
    onError: (error: unknown) => {
      toast.error(error as string);
    },
  });

  const { data: dataUserById, isLoading: isLoadingUserById } = useUserById({
    params: {
      id: id ? Number(id) : null,
    },
  });

  const { mutate: mutateEditUser, isPending: isLoadingEditUser } =
    useUpdateUser({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useUserList"] });
        resetRegister();
        router.push("/user-management");
        toast.success("Updated user successfully");
      },
      onError: (error: unknown) => {
        toast.error(error as string);
      },
    });

  const { mutate: mutateDeleteUser, isPending: isLoadingDeleteUser } =
    useDeleteUser({
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["useUserList"] });
        toast.success("Delete user successfully");
      },
      onError: (errorDeleteAsset: unknown) => {
        toast.error(errorDeleteAsset as string);
      },
    });

  const onValidSubmit: SubmitHandler<InputsRegister> = (data) => {
    modalWarningInfo.open({
      title: "Confirm Save",
      message: (
        <div>
          <p>Are you sure you want to save this User?</p>
        </div>
      ),
      onConfirm: () => {
        if (mode === "add") {
          mutateRegister(data);
        } else {
          mutateEditUser(data);
        }
      },
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<InputsRegister>) => {
    Object.entries(errors).forEach(([key, error]) => {
      console.log(key);
      if (error?.message) {
        toast.error(error.message);
      }
    });
  };

  const handleCancelUserManagement = () => {
    if (mode === "view") {
      router.back();
    } else {
      modalWarningInfo.open({
        title: "Confirm Cancelation",
        message: (
          <div>
            <p>
              Are you sure you want to cancel the creation of this data, the
              data will not be saved.
            </p>
          </div>
        ),
        onConfirm: () => {
          router.push("/user-management");
        },
      });
    }
  };

  const userListColumnDef = useMemo<TMasterUserCol>(() => {
    return [
      {
        width: 90,
        headerName: "No",
        valueGetter: (params: ValueGetterParams<TMasterResponse>) =>
          (params.node?.rowIndex ?? 0) + 1,
      },
      {
        field: "username",
        flex: 1,
        headerName: "User Name",
        width: 200,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
        width: 250,
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        widht: 250,
      },
      {
        field: "areaKerja",
        headerName: "Area Kerja",
        flex: 1,
        widht: 250,
      },
      {
        width: 130,
        headerName: "Action",
        pinned: "right",
        sortable: false,
        cellRenderer: (params: ValueGetterParams<TMasterUserList>) => {
          return (
            <div className="flex gap-1 py-1 items-center justify-center">
              <div className="cursor-pointer">
                <Image
                  onClick={() => {
                    if (params?.data) {
                      resetRegister(params?.data);
                      router.push(
                        `/user-management/${params?.data.id}?mode=view`
                      );
                    }
                  }}
                  src={IconEye}
                  alt="view"
                />
              </div>
              <div className="cursor-point">
                <Image
                  onClick={() => {
                    if (params?.data) {
                      resetRegister(params?.data);
                      router.push(
                        `/user-management/${params?.data.id}?mode=edit`
                      );
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
                        message: (
                          <div>
                            <p>Are you sure you want to delete this user?</p>
                          </div>
                        ),
                        onConfirm: () => {
                          if (!params?.data?.id) return;
                          mutateDeleteUser(params?.data?.id);
                        },
                      });
                    }
                  }}
                  src={DeleteIcon}
                  alt="delete"
                />
              </div>
            </div>
          );
        },
      },
    ];
  }, [dataUserList]);

  const statisticsDataTop = useMemo(
    () => [
      {
        count: isNaN(Number(dataUserList?.totalItems))
          ? 0
          : Number(dataUserList?.totalItems),
        label: "Total Users",
        bgColor: "from-[rgba(2,132,199,0.1)]",
      },
      {
        count: isNaN(Number(dataUserList?.total_user_admin))
          ? 0
          : Number(dataUserList?.total_user_admin),
        label: "User as Admin",
        bgColor: "from-[rgba(250,204,21,0.1)]",
      },
      {
        count: isNaN(Number(dataUserList?.total_user_supervisor_1))
          ? 0
          : Number(dataUserList?.total_user_supervisor_1),
        label: "User as SPV 1",
        bgColor: "from-[rgba(22,163,74,0.1)]",
      },
      {
        count: isNaN(Number(dataUserList?.total_user_supervisor_2))
          ? 0
          : Number(dataUserList?.total_user_supervisor_2),
        label: "User as SPV 2",
        bgColor: "from-[rgba(22,163,74,0.1)]",
      },
    ],
    [dataUserList]
  );

  const rolesOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "supervisor_1", label: "Supervisor 1" },
    { value: "supervisor_2", label: "Supervisor 2" },
  ];

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

  const onDownloadData = (dataUser: TMasterUserList[]) => {
    try {
      const d = dataUser?.map((user) => {
        return {
          "User Name": user?.username,
          Email: user?.email,
          Role: user?.role,
          "Area Kerja": user?.areaKerja,
        };
      });
      const ws = XLSX.utils.json_to_sheet(d);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(data, `user-management.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && dataUserById) {
      resetRegister(dataUserById);
    } else {
      resetRegister({
        username: "",
        email: "",
        role: "",
        areaKerja: "",
      });
    }
  }, [mode, dataUserById]);

  return {
    onDownloadData,
    isLoadingAddUser,
    isLoadingDeleteUser,
    isLoadingEditUser,
    isLoadingUserById,
    isLoadingGetUserList,
    statisticsDataTop,
    userListColumnDef,
    mutateRegister,
    dataUserList,
    rolesOptions,
    registerRegister,
    resetField,
    handleSubmitRegister,
    errorsRegister,
    resetRegister,
    pagination,
    setPagination,
    getValuesRegister,
    controlRegister,
    onInvalidSubmit,
    onValidSubmit,
    handleCancelUserManagement,
    mode,
    searchUser,
    areaKerjaOptions,
    setSearchUser,
    setFilter,
    filter,
    dataGrid,
  };
};

const UserManagementContext = createContext<
  ReturnType<typeof useUserManagementHooks> | undefined
>(undefined);

export const UserManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useUserManagementHooks();
  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagementHooks must be used within an UserManagementProvider"
    );
  }
  return context;
};
export default useUserManagement;
