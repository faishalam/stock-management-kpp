"use client";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import useMaterialDetail from "./hooks";
import DataGrid from "@/components/molecules/datagrid";
import { CAutoComplete, CInput } from "@/components/atoms";
import Header from "./components/header";
import { BlockingLoader } from "@/components/atoms/loader";
import ButtonSubmit from "@/components/atoms/button-submit";

const MaterialListAddPage: React.FC = () => {
  const {
    statisticsDataTop,
    stockListColumnDef,
    dataGrid,
    isLoadingMaterialListById,
    filter,
    setFilter,
    useGlobalLoading,
  } = useMaterialDetail();
  const globalLoading = useGlobalLoading();
  return (
    <>
      {globalLoading ? (
        <BlockingLoader />
      ) : (
        <div className="w-full h-full no-scrollbar">
          <div className="mt-6">
            <Header />
          </div>

          <div className="w-full flex flex-col gap-4 py-6">
            <div className="w-full grid-cols-2 grid md:grid-cols-4 gap-5">
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

          <div className="w-full bg-white shadow-md rounded-xl">
            <div className="w-full bg-white rounded-md">
              <div className="w-full flex gap-3 p-4">
                <div className="flex max-w-full w-full gap-3">
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
                  {/* <div className="flex items-center gap-2">
                    <CInput
                      type="date"
                      className="w-full"
                      placeholder="Cutoff from"
                      onChange={(e) =>
                        setFilter({ ...filter, cutoff_from: e.target.value })
                      }
                      value={filter.cutoff_from}
                    />
                    <span className="text-gray-500">→</span>
                    <CInput
                      type="date"
                      className="w-full"
                      placeholder="Cutoff to"
                      onChange={(e) =>
                        setFilter({ ...filter, cutoff_to: e.target.value })
                      }
                      value={filter.cutoff_to}
                    />
                  </div> */}
                  <CAutoComplete
                    options={[
                      {
                        label: "Submitted",
                        value: "submitted",
                      },
                      {
                        label: "Approved",
                        value: "Approved",
                      },
                      {
                        label: "Completed",
                        value: "completed",
                      },
                      {
                        label: "Revised",
                        value: "revised",
                      },
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
                    placeholder="status"
                  />
                </div>
              </div>
            </div>
            <DataGrid
              columnDefs={stockListColumnDef}
              rowData={dataGrid}
              pagination={true}
              loading={isLoadingMaterialListById}
              paginationPageSize={8}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialListAddPage;

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
