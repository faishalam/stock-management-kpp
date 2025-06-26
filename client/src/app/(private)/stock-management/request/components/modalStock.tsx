import { Box, Modal } from "@mui/material";
import { useMaterial } from "../hooks";
import InfoIcon from "@mui/icons-material/Info";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { CAutoComplete, CInput } from "@/components/atoms";
import useAuth from "@/app/hooks";
import { useEffect, useMemo } from "react";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import moment from "moment";
import ModalHarga from "./modalHarga";
import { TMasterMaterialList } from "@/app/(private)/material-management/material-list/types";

const ModalStock: React.FC = () => {
  const {
    openModalStock,
    setOpenModalStock,
    handleSubmit,
    onInvalidSubmit,
    onValidSubmit,
    control,
    reset,
    modeAdd,
    dataMaterialList,
    watch,
    setValue,
    getValues,
  } = useMaterial();
  const title = useMemo(() => {
    if (modeAdd === "view") return "View Material Stock";
    if (modeAdd === "add") return "Add Material Stock";
    if (modeAdd === "edit") return "Edit Material Stock";
  }, [modeAdd]);
  const { dataUser } = useAuth();
  const watched = watch();
  const quantity = watched.quantity || 0;
  const hargaSatuan = watched.hargaSatuan || 0;

  useEffect(() => {
    const totalHarga = (Number(quantity) || 0) * (Number(hargaSatuan) || 0);
    const currentTotal = getValues("hargaTotal");

    if (currentTotal !== totalHarga.toString()) {
      setValue("hargaTotal", totalHarga.toString());
    }
  }, [quantity, hargaSatuan, getValues, setValue]);
  return (
    <Modal
      open={openModalStock}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="max-w-full w-full flex justify-center items-center"
    >
      <Box className="max-w-full w-[300px] sm:w-[500px] md:w-[700px] rounded-md bg-white">
        <div className="w-full border-b border-gray-300">
          <p className="font-semibold text-sm md:text-lg p-5 text-[#003433]">
            {title}
          </p>
        </div>

        <div className="h-full flex flex-col bg-white rounded-md">
          <div
            className={`grid grid-cols-3 gap-2 bg-[#E8FDFF] shadow py-4 px-6`}
          >
            <div className="space-y-1">
              <p className="text-sm text-[#9CA3AF]">Status</p>
              <p className="text-sm text-[#4B5563]">
                {watched.status ? (
                  <RenderTransactionStatus status={watched.status || "-"} />
                ) : (
                  "-"
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#9CA3AF]">Created At</p>
              <p className="text-sm text-[#4B5563]">
                {watched.createdAt
                  ? moment(watched.createdAt).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <p className="text-sm text-[#9CA3AF]">Harga Total</p>
              </div>
              <p className="text-sm text-[#4B5563]">
                {watched?.hargaTotal
                  ? `Rp ${Number(watched?.hargaTotal).toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>
            <div>
              {watched?.reasonRevise && (
                <div className="text-sm flex flex-col gap-2">
                  <p className="text-[#9CA3AF]">Alasan Revisi</p>
                  <div className="flex text-sm items-center gap-2">
                    <InfoIcon fontSize="small" color="warning" />
                    <p>{watched.reasonRevise}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ModalHarga />
          <form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className="flex flex-col gap-2 justify-between h-full px-6 py-4"
          >
            <div className="flex flex-col gap-2">
              {/* Form Inputs */}
              <Controller
                name="materialId"
                control={control}
                rules={{ required: "Material is required" }}
                render={({ field }) => (
                  <CAutoComplete
                    label="Nama Material*"
                    className="w-full"
                    disabled={modeAdd === "view" || dataUser?.role !== "admin"}
                    options={dataMaterialList ?? []}
                    getOptionLabel={(option) => option.materialName ?? ""}
                    placeholder="Select Material"
                    value={
                      dataMaterialList?.find(
                        (opt: TMasterMaterialList) => opt.id === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.id || null);
                    }}
                  />
                )}
              />

              <Controller
                name="quantity"
                rules={{ required: "Quantity is required" }}
                control={control}
                render={({ field }) => (
                  <CInput
                    type="number"
                    label="Quantity*"
                    className="w-full"
                    placeholder="Enter quantity"
                    disabled={modeAdd === "view" || dataUser?.role !== "admin"}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />

              <CInput
                label="Satuan*"
                className="w-full"
                placeholder="Enter Material Name First..."
                disabled
                value={
                  dataMaterialList?.find(
                    (opt: TMasterMaterialList) => opt.id === watch("materialId")
                  )?.satuan ?? ""
                }
              />

              <Controller
                name="hargaSatuan"
                control={control}
                rules={
                  dataUser?.role === "supervisor_1" ||
                  dataUser?.role === "supervisor_2"
                    ? { required: "Harga is required" }
                    : { required: false }
                }
                render={({ field }) => {
                  const formatCurrency = (value: string) => {
                    const numericValue = value.replace(/\D/g, "");
                    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  };
                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue);
                  };
                  return (
                    <CInput
                      label="Harga Satuan*"
                      disabled={
                        !(
                          modeAdd === "edit" &&
                          (dataUser?.role === "supervisor_1" ||
                            dataUser?.role === "supervisor_2")
                        )
                      }
                      className="w-full"
                      placeholder="Harga hanya dapat diisi oleh supervisor"
                      autoComplete="off"
                      value={formatCurrency(field.value || "")}
                      onChange={handleChange}
                    />
                  );
                }}
              />
              <Controller
                name="hargaTotal"
                control={control}
                rules={
                  dataUser?.role === "supervisor_1" ||
                  dataUser?.role === "supervisor_2"
                    ? { required: "Harga is required" }
                    : { required: false }
                }
                render={({ field }) => {
                  const formatCurrency = (value: string) => {
                    const numericValue = value.replace(/\D/g, "");
                    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                  };

                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue);
                  };

                  return (
                    <CInput
                      label="Harga Total*"
                      disabled
                      className="w-full"
                      placeholder="Harga hanya dapat diisi oleh supervisor"
                      autoComplete="off"
                      value={formatCurrency(field.value || "")}
                      onChange={handleChange}
                    />
                  );
                }}
              />
            </div>

            {/* Buttons at the bottom */}
            <div className="w-full py-5 mt-5 flex justify-end">
              <div className="w-1/2 flex justify-end gap-2">
                <ButtonSubmit
                  btnText="Cancel"
                  classname="px-4 w-1/2 py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => {
                    setOpenModalStock(!openModalStock);
                    reset();
                  }}
                />
                {modeAdd !== "view" && dataUser?.role !== "user" && (
                  <ButtonSubmit
                    btnText="Submit"
                    type="submit"
                    classname="px-4 w-1/2 py-2 bg-[#154940] hover:bg-[#0e342d] border-1 text-sm font-medium rounded-md cursor-pointer text-white transition-all"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalStock;
