import { Box, Modal } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { CAutoComplete, CInput } from "@/components/atoms";
import useAuth from "@/app/hooks";
import { useMemo } from "react";
import RenderTransactionStatus from "@/components/atoms/render-transaction-status";
import moment from "moment";
import { TMasterMaterialList } from "@/app/(private)/material-management/material-list/types";
import useStockMaterial from "../hooks";

const ModalStock: React.FC = () => {
  const {
    openModalStock,
    setOpenModalStock,
    control,
    reset,
    modeAdd,
    watch,
    dataMaterialList,
  } = useStockMaterial();
  const title = useMemo(() => {
    if (modeAdd === "view") return "View Material Stock";
    if (modeAdd === "add") return "Add Material Stock";
    if (modeAdd === "edit") return "Edit Material Stock";
  }, [modeAdd]);
  const { dataUser } = useAuth();
  const watched = watch();
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
            {dataUser.role !== "supervisor_1" ||
              (dataUser.role !== "supervisor_2" && (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <p className="text-sm text-[#9CA3AF]">Total Harga</p>
                  </div>
                  <p className="text-sm text-[#4B5563]">
                    {watched?.hargaTotal
                      ? `Rp ${Number(watched?.hargaTotal).toLocaleString(
                          "id-ID"
                        )}`
                      : "-"}
                  </p>
                </div>
              ))}

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
          <form className="flex flex-col gap-2 justify-between h-full px-6 py-4">
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
                    options={dataMaterialList}
                    disabled={modeAdd === "view" || dataUser?.role !== "admin"}
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
              {dataUser?.role === "supervisor_1" ||
                (dataUser.role === "supervisor_2" && (
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
                        return numericValue.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          "."
                        );
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
                ))}
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
              </div>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalStock;
