export type TMasterResponse = {
  totalItems: number | undefined;
  totalPages: number | undefined;
  currentPage: number | undefined;
  total_roles_user: number | undefined;
  total_roles_head: number | undefined;
  data: TMasterUserList[];
};

export type TMasterUserList = {
  id: number;
  username: string;
  email: string;
  role: string;
  district: string;
  department: string;
  site: string;
  areaKerja: string;
  createdAt: string;
  updatedAt: string;
};

export type InputsRegister = {
  email: string;
  password: string;
  username: string;
  old_password?: string;
  district: string;
  department: string;
  site: string;
  role: string;
  areaKerja: string;
};

export type InputsSearch = {
  search: string;
};

export type TMasterUserCol =
  | ColDef<TMasterUserList>
  | ColGroupDef<TMasterUserList>;
export type TMasterUserColParams = ValueGetterParams<TMasterUserList>;
