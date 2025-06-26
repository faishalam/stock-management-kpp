import React from "react";
import { Calendar } from "lucide-react";

type YearDropdownProps = {
  availableYears: number[];
  selectedYear: number | null;
  handleYearChange: (year: number) => void;
};

const YearDropdown: React.FC<YearDropdownProps> = ({
  availableYears,
  selectedYear,
  handleYearChange,
}) => {
  return (
    <div className="flex w-full gap-3">
      <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Select Year</h2>
        </div>

        <select
          value={selectedYear ?? ""}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Year --</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default YearDropdown;
