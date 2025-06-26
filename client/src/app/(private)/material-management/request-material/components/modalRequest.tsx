import { Box, Button, Modal } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ButtonSubmit from "@/components/atoms/button-submit";
import useAuth from "@/app/hooks";
import { useMemo } from "react";
import useRequestMaterial from "../hooks";

const ModalRequestStock: React.FC = () => {
  const {
    setOpenModalViewRequest,
    openModalViewRequest,
    modeAdd,
    requestDetail,
    setOpenModalRevise,
    handleApprove,
  } = useRequestMaterial();

  const title = useMemo(() => {
    if (modeAdd === "view") return "View Request";
    if (modeAdd === "add") return "Add Request";
    if (modeAdd === "edit") return "Edit Request";
  }, [modeAdd]);

  const { dataUser } = useAuth();
  return (
    <Modal
      open={openModalViewRequest}
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
              <p className="text-sm text-[#9CA3AF]">Nama Material</p>
              <p className="text-sm text-[#4B5563]">
                {requestDetail?.Material?.materialName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#9CA3AF]">No. Material</p>
              <p className="text-sm text-[#4B5563]">
                {requestDetail?.Material?.materialNumber}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#9CA3AF]">Available Stock</p>
              <p className="text-sm text-[#4B5563]">
                {requestDetail?.Material?.totalStock}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#9CA3AF]">Request Stock From User</p>
              <p className="text-sm text-[#4B5563]">
                {requestDetail?.quantity}
              </p>
            </div>

            <div>
              {requestDetail?.reasonRevise && (
                <div className="text-sm flex flex-col gap-2">
                  <p className="text-[#9CA3AF]">Alasan Revisi</p>
                  <div className="flex text-sm items-center gap-2">
                    <InfoIcon fontSize="small" color="warning" />
                    <p>{requestDetail.reasonRevise}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center justify-between h-full px-4 py-4">
            <div className="w-full flex justify-start items-start">
              <div className="w-full flex justify-start gap-2">
                <ButtonSubmit
                  btnText="Cancel"
                  classname="px-4 w-1/2 py-2 border-1 border-gray-300 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => {
                    setOpenModalViewRequest(!openModalViewRequest);
                  }}
                />
              </div>
            </div>
            <div className="flex w-full justify-end gap-2">
              {dataUser?.role === "admin" &&
                requestDetail?.status === "submitted" && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      className="text-black !bg-red-700 flex gap-2 !rounded-md h-[40px]"
                      onClick={() => setOpenModalRevise(true)}
                    >
                      Revise
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="text-black flex gap-2 !rounded-md h-[40px]"
                      onClick={() => {
                        if (!requestDetail?.id) return;
                        handleApprove(requestDetail?.id);
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalRequestStock;
