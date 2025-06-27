import { ValueGetterParams } from "@ag-grid-community/core";
import { TMasterMaterialStockList } from "../../stock-management/request/types";

export type TMasterMaterialList = {
  id?: number;
  materialNumber: string;
  materialName: string;
  satuan: string;
  totalStock: number;
  limited: number;
  User: {
    username: string;
    email: string;
  };
  Stock?: TMasterMaterialStockList[];
  createdAt: Date | string;
};

export type TMaterialFormInput = {
  id?: number;
  materialNumber?: string | null;
  materialName: string;
  satuan: string;
  limited: number;
};

export type TRequestMaterialInput = {
  materialId: number | null;
  quantity: number | null;
  reasonRevise?: stirng | null;
};

export type TMasterMaterialCol =
  | ColDef<TMasterMaterialList>
  | ColGroupDef<TMasterMaterialList>;
export type TMasterMaterialColParams = ValueGetterParams<TMasterMaterialList>;
