"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  TrendingDown,
  Package,
  Calendar,
  BarChart3,
} from "lucide-react";
import useDashboard from "./hooks";
import CustomTooltip from "./components/customTooltip";
import { BlockingLoader } from "@/components/atoms/loader";
import { CAutoComplete } from "@/components/atoms";

const DashboardPage: React.FC = () => {
  const {
    selectedMaterials,
    selectedYear,
    handleMaterialSelect,
    setIsDropdownOpen,
    chartData,
    isDropdownOpen,
    materials,
    colors,
    loading,
    getTotalStockOut,
    useGlobalLoading,
    setSelectedYear,
    availableYears,
  } = useDashboard();

  const globalLoading = useGlobalLoading();

  return (
    <>
      {globalLoading ? (
        <BlockingLoader />
      ) : (
        <div className="w-[100%] h-[100%]">
          <div className="max-w-full">
            <div className="py-6">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <p className="text-gray-600">
                  Track and compare material stock outflow trends by month
                </p>
              </div>
            </div>

            {/* Year Selection */}
            <div className="w-full flex flex-col sm:flex-row sm:gap-3">
              <div className="flex w-full gap-3">
                <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Select Year
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CAutoComplete
                      options={availableYears}
                      className="w-full"
                      getOptionKey={(option) => option.value}
                      renderOption={(props, option) => (
                        <li {...props} key={option.label}>
                          {option.label}
                        </li>
                      )}
                      value={
                        availableYears.find(
                          (opt) => opt.value === selectedYear
                        ) || null
                      }
                      onChange={(_, value) => {
                        if (value) {
                          setSelectedYear(value.value);
                        }
                      }}
                      getOptionLabel={(option) => option.label}
                      placeholder="Select Year"
                    />
                  </div>
                </div>
              </div>

              {/* Material Selection */}
              <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Select Materials to Compare
                  </h2>
                </div>

                <div className="relative ">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-9 md:w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <span className="text-gray-700 text-sm">
                      {selectedMaterials.length === 0
                        ? "Choose materials to compare..."
                        : `${selectedMaterials.length} material(s) selected`}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 md:w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                      {materials.map((material) => {
                        const isSelected = selectedMaterials.find(
                          (m) => m.id === material.id
                        );
                        return (
                          <div
                            key={material.id}
                            onClick={() => handleMaterialSelect(material)}
                            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {material.materialName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {material.materialNumber} • {material.satuan}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {material.totalStock?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">Stock</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Materials */}
                {selectedMaterials.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Materials:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMaterials.map((material, index) => (
                        <div
                          key={material.id}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          {material.materialName}
                          <button
                            onClick={() => handleMaterialSelect(material)}
                            className="ml-1 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Monthly Stock Out Trend - {selectedYear}
                </h2>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading trend data...
                </span>
              </div>
            )}

            {!loading && selectedMaterials.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <Calendar className="w-16 h-16 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  No Materials Selected
                </h3>
                <p className="text-center max-w-md">
                  Select one or more materials from the dropdown above to view
                  their monthly stock out trends for {selectedYear}.
                </p>
              </div>
            )}

            {!loading &&
              selectedMaterials.length > 0 &&
              chartData.length > 0 && (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />

                      {selectedMaterials.map((material, index) => (
                        <Line
                          key={material.id}
                          type="monotone"
                          dataKey={material.materialName}
                          stroke={colors[index % colors.length]}
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          activeDot={{ r: 7 }}
                          name={material.materialName}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
          </div>

          {/* Summary Cards */}
          {selectedMaterials.length > 0 && chartData.length > 0 && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {selectedMaterials.map((material, index) => {
                const totalOut = getTotalStockOut(material.materialName);

                return (
                  <div
                    key={material.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <h3 className="font-medium text-gray-900 truncate">
                        {material.materialName}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {totalOut.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total Stock Out ({selectedYear})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
