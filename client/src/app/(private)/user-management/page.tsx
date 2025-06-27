"use client";
import DownloadIcon from "@mui/icons-material/Download";
import { useRouter } from "next/navigation";
import useUserManagement from "./hooks";
import useAuth from "@/app/hooks";
import { CAutoComplete, CInput } from "@/components/atoms";
import DataGrid from "@/components/molecules/datagrid";
import { BlockingLoader } from "@/components/atoms/loader";
import ButtonSubmit from "@/components/atoms/button-submit";

export default function UserManagementPage() {
  const {
    userListColumnDef,
    statisticsDataTop,
    resetRegister,
    isLoadingGetUserList,
    isLoadingDeleteUser,
    setFilter,
    filter,
    dataGrid,
    areaKerjaOptions,
    onDownloadData
  } = useUserManagement();
  const { dataUser } = useAuth();
  const router = useRouter();
  return (
    <>
      {isLoadingGetUserList ? (
        <BlockingLoader />
      ) : (
        <>
          <div className="w-[100%] h-[100%]">
            <div className="w-full flex flex-col gap-4 py-6">
              <div className="w-full grid grid-cols-2 md:grid-cols-4  gap-5">
                {statisticsDataTop.map((item, index) => (
                  <StatisticsComponentsBottom
                    key={index}
                    label={item.label}
                    count={item.count ?? 0}
                    bgColor={item.bgColor}
                  />
                ))}
              </div>
            </div>
            <div className="w-full bg-white shadow-md rounded-lg">
              <div className="w-full bg-white rounded-md overflow-x-auto">
                <div className="min-w-[1000px] flex gap-3 p-4">
                  <div className="flex max-w-full w-full gap-2">
                    <ButtonSubmit
                      btnIcon={<DownloadIcon className="" />}
                      classname="flex gap-2 text-[10px] bg-[#2976d2] transition-all cursor-pointer hover:bg-[#2956d2] rounded-[8px] px-2 text-white"
                      onClick={() => onDownloadData(dataGrid)}
                    />
                    <CInput
                      value={filter.search}
                      className="w-full"
                      onChange={(e) =>
                        setFilter({ ...filter, search: e.target.value })
                      }
                      placeholder="Search"
                    />
                  </div>
                  <div className="w-full flex gap-3">
                    <CAutoComplete
                      options={[
                        { label: "User", value: "user" },
                        { label: "Admin", value: "admin" },
                        { label: "Supervisor 1", value: "supervisor_1" },
                        { label: "Supervisor 2", value: "supervisor_2" },
                      ]}
                      className="w-full"
                      getOptionKey={(option) => option.value}
                      renderOption={(props, option) => (
                        <li {...props} key={option.value}>
                          {option.label}
                        </li>
                      )}
                      onChange={(_, value) => {
                        setFilter({ ...filter, role: value?.value });
                      }}
                      getOptionLabel={(option) => option.label}
                      placeholder="Roles"
                    />
                    <CAutoComplete
                      options={areaKerjaOptions}
                      className="w-full"
                      getOptionKey={(option) => option.value}
                      renderOption={(props, option) => (
                        <li {...props} key={option.value}>
                          {option.label}
                        </li>
                      )}
                      onChange={(_, value) => {
                        setFilter({ ...filter, areaKerja: value?.value });
                      }}
                      getOptionLabel={(option) => option.label}
                      placeholder="Area Kerja User"
                    />
                    {dataUser?.role === "admin" && (
                      <div className="w-[20%] flex">
                        <ButtonSubmit
                          classname="flex w-full justify-center items-center cursor-pointer text-sm gap-2 text-white !bg-[#154940] hover:!bg-[#0e342d] !rounded-[8px]"
                          btnText="Add User"
                          onClick={() => {
                            router.push("/user-management/new?mode=add");
                            resetRegister();
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DataGrid
                columnDefs={userListColumnDef}
                rowData={dataGrid}
                pagination={true}
                loading={isLoadingGetUserList || isLoadingDeleteUser}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

const StatisticsComponentsBottom: React.FC<{
  bgColor: string;
  count: string | number;
  label: string;
}> = ({ count, label }) => {
  return (
    <div
      className={`flex flex-col bg-gradient-to-l bg-[#CCE1E0] to-white shadow-md p-4 rounded-lg`}
    >
      <p className="text-[14px] sm:text-[14px] md:text-[22px] font-bold">
        {count}
      </p>
      <p className="text-[#006766] font-semibold text-xs sm:text-sm md:text-md">
        {label}
      </p>
    </div>
  );
};
