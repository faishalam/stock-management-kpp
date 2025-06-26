"use client";

import Image from "next/image";
import HeaderForm from "./components/HeaderForm";
import FormLoginSection from "./components/FormLoginSection";

export default function LoginPage() {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/bgnew.png"
            alt="image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-70" />
        </div>

        <div className="relative z-10 w-full h-full flex justify-center items-center px-8 sm:px-24">
          <div className="w-full max-w-2xl bg-white flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
            <div className="w-full flex flex-col justify-center items-center py-10 px-8">
              <HeaderForm
                title="Welcome back, Login!"
                description="Login to your account to continue"
              />
              <FormLoginSection />
            </div>
            <div className="hidden md:block w-sm relative">
              <div className="absolute inset-0">
                <Image
                  src="/assets/side.png"
                  alt="side"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-35" />
              </div>

              <div className="relative flex justify-end p-4">
                <Image
                  src="/assets/register.png"
                  alt="logo"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
