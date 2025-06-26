export interface User {
  username: string;
  email: string;
}

export interface Material {
  id: number;
  materialName: string;
  materialNumber: string;
  satuan: string;
  totalStock: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: User;
  Stocks: StockOutData[];
}

export interface MaterialListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: Material[];
}

export interface StockOutData {
  id: number;
  materialId: number;
  quantity: number;
  status: string;
  hargaSatuan: string;
  hargaTotal: string;
  reasonRevise: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: User;
  Material: {
    materialName: string;
    materialNumber: string;
    satuan: string;
  };
}

export interface ChartDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: number;
  }>;
  label?: string;
}
