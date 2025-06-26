import useMaterialDetail from "../hooks";

export default function Header() {
  const { dataMaterialById } = useMaterialDetail();
  return (
    <div
      className={`rounded-lg grid grid-cols-2 gap-4 bg-[#E8FDFF] shadow-md px-5 py-3`}
    >
      <div className="space-y-1">
        <p className="text-sm text-[#9CA3AF]">Nama Material</p>
        <p className="text-sm text-[#4B5563]">
          {dataMaterialById?.materialName}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[#9CA3AF]">Material No.</p>
        <p className="text-sm text-[#4B5563]">
          {dataMaterialById?.materialNumber}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[#9CA3AF]">Submitted By</p>
        <p className="text-sm text-[#4B5563]">
          {dataMaterialById?.User.username}
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[#9CA3AF]">Satuan</p>
        <p className="text-sm text-[#4B5563]">{dataMaterialById?.satuan}</p>
      </div>
    </div>
  );
}
