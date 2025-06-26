"use client";

import { Controller } from "react-hook-form";
import useUserManagement from "../hooks";
import { CAutoComplete, CInput } from "@/components/atoms";
import ButtonSubmit from "@/components/atoms/button-submit";
import { BlockingLoader } from "@/components/atoms/loader";

export default function UserManagementAddPage() {
  const {
    handleSubmitRegister,
    controlRegister,
    rolesOptions,
    areaKerjaOptions,
    onValidSubmit,
    onInvalidSubmit,
    handleCancelUserManagement,
    mode,
    isLoadingUserById,
  } = useUserManagement();
  return (
    <>
      {isLoadingUserById ? (
        <BlockingLoader />
      ) : (
        <div className="w-full h-full no-scrollbar">
          <div className="w-full h-full bg-white p-4 shadow-md rounded-sm mt-5">
            <form
              onSubmit={handleSubmitRegister(onValidSubmit, onInvalidSubmit)}
            >
              <div className="w-full flex flex-col gap-2 px-4 py-2">
                <Controller
                  name="username"
                  control={controlRegister}
                  rules={{
                    required: "Username is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/i,
                      message: "Username hanya boleh huruf dan angka",
                    },
                  }}
                  render={({ field }) => (
                    <CInput
                      label="Username*"
                      disabled={mode === "view"}
                      className="w-full"
                      placeholder="Enter username"
                      {...field}
                      autoComplete="off"
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={controlRegister}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <CInput
                      label="Email*"
                      autoComplete="off"
                      disabled={mode === "view"}
                      className="w-full"
                      placeholder="Enter email"
                      {...field}
                    />
                  )}
                />
                {mode === "add" && (
                  <Controller
                    name="password"
                    control={controlRegister}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password minimal 8 karakter",
                      },
                    }}
                    render={({ field }) => (
                      <CInput
                        label="Password*"
                        autoComplete="off"
                        className="w-full"
                        placeholder="Enter password"
                        {...field}
                      />
                    )}
                  />
                )}

                <Controller
                  name="role"
                  control={controlRegister}
                  rules={{
                    required: "Role is required",
                  }}
                  render={({ field }) => (
                    <CAutoComplete
                      label="Role*"
                      className="w-full"
                      disabled={mode === "view"}
                      options={rolesOptions ?? []}
                      getOptionLabel={(option) => option.label ?? ""}
                      placeholder="Select role"
                      value={
                        rolesOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || "");
                      }}
                    />
                  )}
                />
                <Controller
                  name="areaKerja"
                  control={controlRegister}
                  rules={{
                    required: "Area kerja is required",
                  }}
                  render={({ field }) => (
                    <CAutoComplete
                      label="Area Kerja*"
                      className="w-full"
                      disabled={mode === "view"}
                      options={areaKerjaOptions ?? []}
                      getOptionLabel={(option) => option.label ?? ""}
                      placeholder="Select user area kerja"
                      value={
                        rolesOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || "");
                      }}
                    />
                  )}
                />
              </div>

              <div className="mt-10 px-4">
                <div className="flex gap-2 w-full max-w-full justify-end">
                  <ButtonSubmit
                    type={"button"}
                    classname={
                      "w-[100px] max-w-full text-sm rounded-md bg-white hover:bg-gray-50 text-black border p-2"
                    }
                    btnText="Cancel"
                    onClick={handleCancelUserManagement}
                  />
                  {mode !== "view" && (
                    <ButtonSubmit
                      type={"submit"}
                      classname={
                        "w-[100px] max-w-full rounded-md text-sm bg-[#154940] hover:bg-[#0e342d] text-white p-2"
                      }
                      btnText="Save"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
