"use client";
import DataGrid from "@/components/molecules/datagrid";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { CAutoComplete, CInput } from "@/components/atoms";
import useMaterial from "./hooks";
import ModalStock from "./components/modalStock";
import useAuth from "@/app/hooks";
import ModalRevise from "./components/modalRevise";
import { BlockingLoader } from "@/components/atoms/loader";
import ButtonSubmit from "@/components/atoms/button-submit";

const RequestMaterialPage: React.FC = () => {
  const {
    setOpenModalStock,
    setModeAdd,
    dataGrid,
    materialStockColumnDef,
    statisticsDataBottom,
    filter,
    setFilter,
    reset,
    selectedId,
    handleApprove,
    setOpenModalRevise,
    useGlobalLoading,
    dataMaterialList,
  } = useMaterial();
  const globalLoading = useGlobalLoading();
  const { dataUser } = useAuth();
  return (
    <>
      {globalLoading ? (
        <BlockingLoader />
      ) : (
        <div className="w-[100%] h-[100%]">
          <ModalRevise />
          <ModalStock />
          <div className="w-full flex flex-col gap-4 py-6">
            <div className="w-full hidden md:grid md:grid-cols-3 gap-5">
              {statisticsDataBottom.map((item, index) => (
                <StatisticsComponentsBottom
                  key={index}
                  label={item.label}
                  count={item.count}
                  bgColor={item.bgColor}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-white rounded-lg overflow-x-auto">
            <div className="min-w-[1000px] flex gap-3 p-4">
              <div className="flex max-w-full w-full gap-2">
                <ButtonSubmit
                  btnIcon={<DownloadIcon className="" />}
                  classname="flex gap-2 text-[10px] bg-[#2976d2] transition-all cursor-pointer hover:bg-[#2956d2] rounded-[8px] px-2 text-white"
                />
                <CInput
                  value={filter.search}
                  className="w-full rounded-2xl"
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  placeholder="Search"
                />
              </div>
              <div className="w-full flex gap-3">
                <CAutoComplete
                  options={[
                    { label: "Submitted", value: "submitted" },
                    { label: "Approved", value: "approved" },
                    { label: "Revised", value: "revised" },
                  ]}
                  className="w-full"
                  getOptionKey={(option) => option.value}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      {option.label}
                    </li>
                  )}
                  onChange={(_, value) => {
                    setFilter({ ...filter, status: value?.value });
                  }}
                  getOptionLabel={(option) => option.label}
                  placeholder="Status"
                />
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
                {dataUser?.role === "admin" && (
                  <div className="w-[50%] flex">
                    <ButtonSubmit
                      classname="flex w-full justify-center items-center cursor-pointer text-sm gap-2 text-white !bg-[#154940] hover:!bg-[#0e342d] !rounded-[8px]"
                      btnText="Input Stock"
                      onClick={() => {
                        setOpenModalStock(true);
                        setModeAdd("add");
                        reset({
                          materialId: null,
                          quantity: null,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full bg-white shadow-md">
            <DataGrid
              columnDefs={materialStockColumnDef}
              rowData={dataGrid}
              pagination={true}
              paginationPageSize={7}
            />
            {(dataUser?.role === "supervisor_1" ||
              dataUser?.role === "supervisor_2") && (
              <div className="flex justify-end gap-2 p-4">
                <Button
                  disabled={!selectedId}
                  variant="contained"
                  color="primary"
                  className="text-black !bg-red-700 flex gap-2 !rounded-[8px] h-[40px]"
                  onClick={() => setOpenModalRevise(true)}
                >
                  Revise
                </Button>
                <Button
                  disabled={!selectedId}
                  variant="contained"
                  color="primary"
                  className="text-black flex gap-2 !rounded-[8px] h-[40px]"
                  onClick={() => {
                    if (selectedId) {
                      handleApprove(selectedId);
                    }
                  }}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RequestMaterialPage;

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
