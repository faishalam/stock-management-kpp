export type TMaterialStockInput = {
  id?: number;
  materialId: number | null;
  quantity: number | null;
  hargaSatuan: string | null;
  hargaTotal: string | null;
  status?: string | null;
  createdAt?: string | null;
  reasonRevise?: string | null;
};

export type TUser = {
  username: string;
  email: string;
};

export type TMaterial = {
  materialName: string;
  materialNumber: string;
  satuan: string;
};

export type TMasterMaterialStockList = {
  id: number;
  materialId: number;
  quantity: number;
  status: "submitted" | "approved_1" | "completed" | string; // sesuaikan status lain jika ada
  hargaSatuan: number | null;
  hargaTotal: number | null;
  reasonRevise: string | null;
  userId: number;
  createdAt: string; // ISO date string
  updatedAt: string;
  User: TUser;
  Material: TMaterial;
};

export type TMasterMaterialStockListCol =
  | ColDef<TMasterMaterialStockList>
  | ColGroupDef<TMasterMaterialStockList>;
export type TMasterMaterialStockListParams =
  ValueGetterParams<TMasterMaterialStockList>;
