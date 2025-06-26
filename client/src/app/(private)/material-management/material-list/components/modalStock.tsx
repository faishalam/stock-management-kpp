import { Box, Modal } from "@mui/material";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { CAutoComplete, CInput } from "@/components/atoms";
import { useMemo } from "react";
import useMaterialList from "../hooks";

const ModalStock: React.FC = () => {
  const {
    openModalStock,
    setOpenModalStock,
    handleSubmit,
    onInvalidSubmit,
    onValidSubmit,
    control,
    satuanOptions,
    reset,
    modeAdd,
  } = useMaterialList();

  const title = useMemo(() => {
    if (modeAdd === "add") return "Add Material Stock";
    if (modeAdd === "edit") return "Edit Material Stock";
  }, [modeAdd]);

  return (
    <Modal
      open={openModalStock}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="max-w-full w-full flex justify-center items-center"
    >
      <Box className="max-w-full w-[300px] sm:w-[500px] md:w-[600px] h-[45vh] rounded-md bg-white">
        <div className="w-full border-b border-gray-300">
          <p className="font-semibold text-sm md:text-lg p-5 text-[#003433]">
            {title}
          </p>
        </div>

        <div className="py-4 px-6 h-full flex flex-col bg-white rounded-md">
          <form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            className="flex flex-col gap-2 justify-between h-full"
          >
            <div className="flex flex-col gap-2">
              {/* Form Inputs */}
              <Controller
                name="materialNumber"
                control={control}
                render={({ field }) => (
                  <CInput
                    label="Material Stock Number*"
                    className="w-full"
                    disabled
                    placeholder="M-XXXXX"
                    {...field}
                    autoComplete="off"
                  />
                )}
              />
              <Controller
                name="materialName"
                control={control}
                rules={{ required: "Nama Material is required" }}
                render={({ field }) => (
                  <CInput
                    label="Nama Material*"
                    className="w-full"
                    disabled={modeAdd === "view"}
                    placeholder="Enter material name"
                    {...field}
                    autoComplete="off"
                  />
                )}
              />
              <Controller
                name="satuan"
                control={control}
                rules={{ required: "Satuan is required" }}
                render={({ field }) => (
                  <CAutoComplete
                    label="Satuan*"
                    className="w-full"
                    disabled={modeAdd === "view"}
                    options={satuanOptions ?? []}
                    getOptionLabel={(option) => option.label ?? ""}
                    placeholder="Select satuan"
                    value={
                      satuanOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.value || "");
                    }}
                  />
                )}
              />
              <Controller
                name="limited"
                control={control}
                rules={{ required: "limited is required" }}
                render={({ field }) => (
                  <CInput
                    label="Limited Request User*"
                    disabled={modeAdd === "view"}
                    type="number"
                    className="w-full"
                    placeholder="Enter request limited"
                    {...field}
                    autoComplete="off"
                  />
                )}
              />
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-2 bottom-0 w-full">
              <ButtonSubmit
                btnText="Submit"
                type="submit"
                classname="px-4 w-full py-2 bg-[#154940] hover:bg-[#0e342d] border-1 text-sm font-medium rounded-md cursor-pointer text-white transition-all"
              />
              <ButtonSubmit
                btnText="Cancel"
                classname="px-4 w-full py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  setOpenModalStock(!openModalStock);
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

export default ModalStock;
