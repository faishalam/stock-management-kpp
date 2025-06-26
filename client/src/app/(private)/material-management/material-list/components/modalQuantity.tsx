import { Box, Modal } from "@mui/material";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { CInput } from "@/components/atoms";
import useMaterialList from "../hooks";
import { useMemo } from "react";

const ModalQuantity: React.FC = () => {
  const {
    openModalQuantity,
    setOpenModalQuantity,
    resetRequest,
    handleSubmitRequest,
    modeAdd,
    controleRequest,
    onInvalidSubmitQuantity,
    onValidSubmitQuantity,
  } = useMaterialList();

  const title = useMemo(() => {
    if (modeAdd === "add") return "Add Request";
    if (modeAdd === "edit") return "Edit Request";
    if (modeAdd === "view") return "View Request";
  }, [modeAdd]);

  return (
    <Modal
      open={openModalQuantity}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="max-w-full w-full flex justify-center items-center"
    >
      <Box className="max-w-full w-[300px] sm:w-[500px] rounded-md bg-white">
        <div className="w-full border-b border-gray-300">
          <p className="font-semibold text-sm md:text-lg p-5 text-[#003433]">
            {title}
          </p>
        </div>

        <div className="h-full flex flex-col bg-white rounded-md">
          <form
            onSubmit={handleSubmitRequest(
              onValidSubmitQuantity,
              onInvalidSubmitQuantity
            )}
            className="flex flex-col gap-2 justify-between h-full py-4 px-6"
          >
            <Controller
              name="quantity"
              control={controleRequest}
              rules={{
                required: "Quantity is required",
              }}
              render={({ field }) => (
                <CInput
                  label="Quantity*"
                  disabled={modeAdd === "view"}
                  type="number"
                  className="w-full"
                  placeholder="Enter quantity request"
                  {...field}
                  autoComplete="off"
                />
              )}
            />
            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-2 bottom-0 w-full mt-5">
              {modeAdd !== "view" && (
                <ButtonSubmit
                  btnText="Submit"
                  type="submit"
                  classname="px-4 w-full py-2 bg-[#154940] hover:bg-[#0e342d] border-1 text-sm font-medium rounded-md cursor-pointer text-white transition-all"
                />
              )}
              <ButtonSubmit
                btnText="Cancel"
                classname="px-4 w-full py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  setOpenModalQuantity(!openModalQuantity);
                  resetRequest();
                }}
              />
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalQuantity;
