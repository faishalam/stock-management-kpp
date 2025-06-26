import { Box, Modal } from "@mui/material";
import { useMaterial } from "../hooks";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";
import useAuth from "@/app/hooks";

const ModalHarga: React.FC = () => {
  const {
    openModalHarga,
    setOpenModalHarga,
    handleSubmit,
    onInvalidSubmitHarga,
    onValidSubmitHarga,
    control,
    reset,
    modeAdd,
    watch,
  } = useMaterial();
  const watched = watch();
  const { dataUser } = useAuth();

  return (
    <Modal
      open={openModalHarga}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="max-w-full w-full flex justify-center items-center"
    >
      <Box className="max-w-full w-[300px] sm:w-[500px] rounded-md bg-white">
        <div className="w-full border-b border-gray-300">
          <p className="font-semibold text-sm md:text-lg p-5 text-[#003433]">
            Update Harga
          </p>
        </div>

        <div className="h-full flex flex-col bg-white rounded-md">
          <form
            onSubmit={handleSubmit(onValidSubmitHarga, onInvalidSubmitHarga)}
            className="flex flex-col gap-2 justify-between h-full py-4 px-6"
          >
            <Controller
              name="hargaSatuan"
              control={control}
              rules={{ required: "Harga is required" }}
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
                const quantity = watched.quantity;
                const hargaSatuan = watched.hargaSatuan;

                // Hitung total harga
                const totalHarga =
                  parseInt(String(quantity || 0)) *
                  parseInt(String(hargaSatuan || 0));

                // Update nilai ke form jika berubah
                if (field.value !== totalHarga.toString()) {
                  field.onChange(totalHarga.toString());
                }

                const formatCurrency = (value: string) => {
                  const numericValue = value.replace(/\D/g, "");
                  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                };

                // Handle change hanya jika supervisor boleh edit manual (opsional)
                const handleChange = (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  field.onChange(rawValue);
                };

                const isSupervisor =
                  dataUser?.role === "supervisor_1" ||
                  dataUser?.role === "supervisor_2";

                return (
                  <CInput
                    label="Harga Total*"
                    disabled={!(modeAdd === "edit" && isSupervisor)}
                    className="w-full"
                    placeholder="Harga hanya dapat diisi oleh supervisor"
                    autoComplete="off"
                    value={formatCurrency(field.value || "")}
                    onChange={handleChange}
                  />
                );
              }}
            />

            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-2 bottom-0 w-full mt-5">
              {modeAdd !== "view" && (
                <ButtonSubmit
                  btnText="Submi & Approve"
                  type="submit"
                  classname="px-4 w-full py-2 bg-[#154940] hover:bg-[#0e342d] border-1 text-sm font-medium rounded-md cursor-pointer text-white transition-all"
                />
              )}
              <ButtonSubmit
                btnText="Cancel"
                classname="px-4 w-full py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  setOpenModalHarga(!openModalHarga);
                  reset();
                }}
              />
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalHarga;
