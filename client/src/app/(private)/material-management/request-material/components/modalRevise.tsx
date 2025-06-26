import { Box, Modal } from "@mui/material";
import ButtonSubmit from "@/components/atoms/button-submit";
import { Controller } from "react-hook-form";
import { TextArea } from "@/components/atoms/Input-text-area";
import useRequestMaterial from "../hooks";

const ModalRevise: React.FC = () => {
  const {
    openModalRevise,
    setOpenModalRevise,
    handleSubmit,
    onInvalidSubmitRevise,
    onValidSubmitRevise,
    control,
    reset,
  } = useRequestMaterial();
  return (
    <Modal
      open={openModalRevise}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="max-w-full w-full flex justify-center items-center"
    >
      <Box className="max-w-full w-[300px] sm:w-[500px] rounded-md bg-white">
        <div className="w-full border-b border-gray-300">
          <p className="font-semibold text-sm md:text-lg p-5 text-[#003433]">
            Alasan Revisi
          </p>
        </div>

        <div className="h-full flex flex-col bg-white rounded-md">
          <form
            onSubmit={handleSubmit(onValidSubmitRevise, onInvalidSubmitRevise)}
            className="flex flex-col gap-2 justify-between h-full py-4 px-6"
          >
            <Controller
              name="reasonRevise"
              control={control}
              rules={{
                required: "Alasan Revisi is required",
              }}
              render={({ field: { onChange, value, ref } }) => (
                <TextArea
                  label="Alasan Revisi*"
                  className="!w-full"
                  placeholder="Enter revisi"
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                  autoComplete="off"
                />
              )}
            />

            {/* Buttons at the bottom */}
            <div className="flex flex-col gap-2 bottom-0 w-full mt-5">
              <ButtonSubmit
                btnText="Submit"
                type="submit"
                classname="px-4 w-full py-2 bg-[#154940] hover:bg-[#0e342d] border-1 text-sm font-medium rounded-md cursor-pointer text-white transition-all"
              />
              <ButtonSubmit
                btnText="Cancel"
                classname="px-4 w-full py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  setOpenModalRevise(!openModalRevise);
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

export default ModalRevise;
