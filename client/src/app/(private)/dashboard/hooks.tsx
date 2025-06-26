"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ChartDataPoint, Material } from "./types";
import useMaterialStockList from "@/service/dashboard/useMaterialStock";
import useAuth from "@/app/hooks";

const useDashbordHooks = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { isLoadingGetUserLoggedIn } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [availableYears, setAvailableYears] = useState<
    { label: string; value: number }[]
  >([
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
    { label: "2027", value: 2027 },
    { label: "2028", value: 2028 },
    { label: "2029", value: 2029 },
    { label: "2030", value: 2030 },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: dataMaterialWithStock, isLoading: isLoadingRequestMaterial } =
    useMaterialStockList({
      params: {
        year: selectedYear,
      },
    });

  const dataGrid = useMemo(() => {
    if (!dataMaterialWithStock) return [];

    return dataMaterialWithStock;
  }, [dataMaterialWithStock]);

  const colors: string[] = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  const refreshChartData = async (): Promise<void> => {
    if (selectedMaterials.length === 0) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newChartData: ChartDataPoint[] = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Initialize monthlyData with all months and zero quantities
      const monthlyData: { [month: string]: ChartDataPoint } = {};
      months.forEach((month) => {
        monthlyData[month] = { month };
        selectedMaterials.forEach((material) => {
          monthlyData[month][material.materialName] = 0;
        });
      });

      // Aggregate quantities by month and material
      selectedMaterials.forEach((material) => {
        material.Stocks.forEach((stock) => {
          const stockDate = new Date(stock.createdAt);
          const monthName = months[stockDate.getMonth()];
          if (!monthlyData[monthName]) {
            monthlyData[monthName] = { month: monthName };
            selectedMaterials.forEach((mat) => {
              monthlyData[monthName][mat.materialName] = 0;
            });
          }
          monthlyData[monthName][material.materialName] =
            (Number(monthlyData[monthName][material.materialName]) || 0) +
            stock.quantity;
        });
      });

      // For each month, calculate total stock and push to newChartData
      months.forEach((month) => {
        const dataPoint = monthlyData[month];
        const totalStock = selectedMaterials.reduce(
          (total, material) =>
            total + (Number(dataPoint[material.materialName]) || 0),
          0
        );
        dataPoint.totalStock = totalStock;
        newChartData.push(dataPoint);
      });

      setChartData(newChartData);
      setLoading(false);
    }, 1000);
  };

  const handleMaterialSelect = async (material: Material): Promise<void> => {
    const isSelected = selectedMaterials.find((m) => m.id === material.id);

    if (isSelected) {
      // Remove material from selection
      setSelectedMaterials((prev) => prev.filter((m) => m.id !== material.id));
      setChartData((prev) => {
        return prev.map((item) => {
          const newItem = { ...item };
          delete newItem[material.materialName];
          delete newItem[`${material.materialName}_cumulative`];
          return newItem;
        });
      });
    } else {
      // Add material to selection
      setSelectedMaterials((prev) => [...prev, material]);
      await refreshChartData();
    }
  };

  const getTotalStockOut = (materialName: string): number => {
    return chartData.reduce((total, item) => {
      const value = item[materialName];
      return total + (typeof value === "number" ? value : 0);
    }, 0);
  };

  useEffect(() => {
    setMaterials(dataGrid);
  }, [dataGrid]);

  // Reset chart when year changes
  useEffect(() => {
    if (selectedMaterials.length > 0) {
      refreshChartData();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedMaterials.length > 0) {
      refreshChartData();
    }
  }, [selectedMaterials]);

  useEffect(() => {
    if (dataGrid.length === 0) {
      setChartData([]);
    }
  }, [selectedYear]);

  function useGlobalLoading() {
    return isLoadingRequestMaterial || isLoadingGetUserLoggedIn;
  }

  return {
    isDropdownOpen,
    useGlobalLoading,
    setIsDropdownOpen,
    getTotalStockOut,
    colors,
    setSelectedYear,
    handleMaterialSelect,
    refreshChartData,
    availableYears,
    materials,
    selectedYear,
    selectedMaterials,
    setAvailableYears,
    chartData,
    loading,
  };
};

const useDashboardContext = createContext<
  ReturnType<typeof useDashbordHooks> | undefined
>(undefined);

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = useDashbordHooks();
  return (
    <useDashboardContext.Provider value={value}>
      {children}
    </useDashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(useDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within an DashboardProvider"
    );
  }
  return context;
};
export default useDashboard;
