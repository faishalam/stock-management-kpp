"use client";
import DataGrid from "@/components/molecules/datagrid";
import DownloadIcon from "@mui/icons-material/Download";
import { CAutoComplete, CInput } from "@/components/atoms";
import { useStockMaterial } from "./hooks";
import { BlockingLoader } from "@/components/atoms/loader";
import ModalStock from "./components/modalStock";
import ButtonSubmit from "@/components/atoms/button-submit";

const StockMaterialPage: React.FC = () => {
  const {
    dataGrid,
    materialStockColumnDef,
    filter,
    dataMaterialList,
    setFilter,
    satuanOptions,
    statisticsDataTop,
    useGlobalLoading,
  } = useStockMaterial();
  const globalLoading = useGlobalLoading();
  return (
    <>
      {globalLoading ? (
        <BlockingLoader />
      ) : (
        <div className="w-[100%] h-[100%]">
          <ModalStock />
          <div className="w-full flex flex-col gap-4 py-6">
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-5">
              {statisticsDataTop.map((item, index) => (
                <StatisticsComponentsBottom
                  key={index}
                  label={item.label}
                  count={item.count}
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
                </div>
              </div>
            </div>
            <DataGrid
              columnDefs={materialStockColumnDef}
              rowData={dataGrid}
              pagination={true}
              paginationPageSize={7}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockMaterialPage;

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
