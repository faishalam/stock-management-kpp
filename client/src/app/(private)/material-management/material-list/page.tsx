"use client";
import DataGrid from "@/components/molecules/datagrid";
import DownloadIcon from "@mui/icons-material/Download";
import { CAutoComplete, CInput } from "@/components/atoms";
import useAuth from "@/app/hooks";
import ModalStock from "./components/modalStock";
import useMaterialList from "./hooks";
import { BlockingLoader } from "@/components/atoms/loader";
import ButtonSubmit from "@/components/atoms/button-submit";
import ModalQuantity from "./components/modalQuantity";
import { toast } from "react-toastify";

const MaterialListPage: React.FC = () => {
  const {
    stockListColumnDef,
    dataGrid,
    isLoadingMaterialList,
    statisticsDataTop,
    setFilter,
    openModalStock,
    filter,
    setOpenModalStock,
    reset,
    setModeAdd,
    setOpenModalQuantity,
    satuanOptions,
    useGlobalLoading,
    dataMaterialList,
    resetRequest,
    selectedId,
  } = useMaterialList();

  const isBlockingLoading = useGlobalLoading();
  const { dataUser } = useAuth();

  return (
    <>
      {isBlockingLoading ? (
        <BlockingLoader />
      ) : (
        <>
          <div className="w-[100%] h-[100%]">
            <ModalStock />
            <div className="w-full flex flex-col gap-4 py-6">
              <div className="w-full grid grid-cols-2  gap-5">
                {statisticsDataTop.map((item, index) => (
                  <StatisticsComponents
                    key={index}
                    label={item.label}
                    count={item.count ?? 0}
                    bgColor={item.bgColor}
                  />
                ))}
              </div>
            </div>
            <div className="w-full bg-white shadow-md rounded-t-lg">
              <div className="w-full bg-white rounded-md overflow-x-auto">
                <div className="min-w-[1000px] flex gap-3 p-4">
                  <div className="flex w-full gap-2">
                    <ButtonSubmit
                      btnIcon={<DownloadIcon className="" />}
                      classname="flex gap-2 text-[10px] bg-[#2976d2] transition-all cursor-pointer hover:bg-[#2956d2] rounded-[8px] px-2 text-white"
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
                    <div className="w-full flex gap-3">
                      <CAutoComplete
                        options={satuanOptions}
                        className="w-full"
                        getOptionKey={(option) => option.value}
                        renderOption={(props, option) => (
                          <li {...props} key={option.value}>
                            {option.label}
                          </li>
                        )}
                        onChange={(_, value) => {
                          setFilter({ ...filter, satuan: value?.value });
                        }}
                        getOptionLabel={(option) => option.label}
                        placeholder="Satuan"
                      />
                      <ModalQuantity />
                      <CAutoComplete
                        options={dataMaterialList ?? []}
                        className="w-full"
                        getOptionKey={(option) => option.value}
                        onChange={(_, value) => {
                          setFilter({
                            ...filter,
                            namaMaterial: value?.materialName,
                          });
                        }}
                        getOptionLabel={(option) => option.materialName ?? ""}
                        placeholder="Nama Material"
                      />
                      {dataUser?.role === "user" && (
                        <div className="w-[50%] flex">
                          <ButtonSubmit
                            classname={`flex w-full justify-center items-center cursor-pointer text-sm gap-2 text-white !bg-[#154940] hover:!bg-[#0e342d] !rounded-[8px] `}
                            btnText="Request Material"
                            onClick={() => {
                              if (!selectedId)
                                return toast.error("Pilih salah satu material");
                              setOpenModalQuantity(!openModalStock);
                              resetRequest({
                                quantity: null,
                              });
                              setModeAdd("add");
                            }}
                          />
                        </div>
                      )}
                      {dataUser?.role === "admin" && (
                        <div className="w-[50%] flex">
                          <ButtonSubmit
                            classname="flex w-full justify-center items-center cursor-pointer text-sm gap-2 text-white !bg-[#154940] hover:!bg-[#0e342d] !rounded-[8px]"
                            btnText="Add Material"
                            onClick={() => {
                              reset({
                                materialName: "",
                                satuan: "",
                                materialNumber: null,
                              });
                              setOpenModalStock(true);
                              setModeAdd("add");
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DataGrid
                columnDefs={stockListColumnDef}
                rowData={dataGrid || []}
                pagination={true}
                loading={isLoadingMaterialList}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MaterialListPage;

const StatisticsComponents: React.FC<{
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
      <p className="font-semibold text-xs sm:text-sm md:text-md">{label}</p>
    </div>
  );
};
