import { ValueGetterParams } from "@ag-grid-community/core";

export type TRequestMaterialList = {
  id?: number;
  status: string;
  reasonRevise: null;
  quantity: number;
  createdAt: string | Date;
  User: {
    username: string;
    id: number;
    areaKerja: string;
  };
  Material: {
    materialName: string;
    materialNumber: string;
    satuan: string;
    totalStock: number;
  };
};

export type TRequestMaterialCol =
  | ColDef<TRequestMaterialList>
  | ColGroupDef<TRequestMaterialList>;
export type TRequestMaterialParams = ValueGetterParams<TRequestMaterialList>;
