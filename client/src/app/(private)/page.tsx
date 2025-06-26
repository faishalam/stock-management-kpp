"use client";
import { Loader } from "@/components/atoms/loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
  return (
    <div className="w-[100%] h-[100%] items-center justify-center grid">
      <Loader text="Redirecting..." />
    </div>
  );
};
export default DashboardPage;
