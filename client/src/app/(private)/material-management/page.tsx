"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/atoms/loader";

const MaterialManagementPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/material-management/incoming");
  }, [router]);
  return (
    <div className="w-[100%] h-[100%] items-center justify-center grid">
      <Loader text="Redirecting..." />
    </div>
  );
};

export default MaterialManagementPage;
