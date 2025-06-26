"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import BackIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import useAuth from "@/app/hooks";
import { useMemo } from "react";

const userNavigation = [{ name: "Sign out" }];

export default function Navbar() {
  const { dataUser, setSidebarOpen, isLoadingGetUserLoggedIn } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const mode = useSearchParams().get("mode");

  const handleLogout = () => {
    router.push("/login");
    localStorage.clear();
  };

  const title = useMemo(() => {
    if (pathname === "/stock-management/request") {
      return "Input & Approval Stock";
    }
    if (pathname === "/material-management/material-list") {
      return "Raw Material";
    }
    if (pathname === "/stock-management/stock-material") {
      return "Stocks Material";
    }
    if (pathname === "/user-management") {
      return "User Management";
    }
    if (pathname === `/user-management/${id}` && id && mode) {
      return `${mode[0].toUpperCase() + mode?.slice(1)} User`;
    }
    if (pathname === `/material-management/material-list/${id}` && id && mode) {
      return `${mode[0].toUpperCase() + mode?.slice(1)} Stock Material`;
    }
    if(pathname === "/material-management/request-material") {
      return "Request & Approval"
    }
    if(pathname === "/material-management/completed") {
      return "Completed Request"
    }
      if(pathname === "/dashboard") {
      return "Material Stock Out Trend"
    }
  }, [pathname]);

  return (
    <>
      <div className="sticky top-0 z-50 flex shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 rounded-lg">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

        <div className="flex w-full items-center justify-between gap-x-4 lg:gap-x-6 h-[55px]">
          {!id ? (
            <div className="text-xs md:text-lg !font-bold text-[#0e342d]">
              {title}
            </div>
          ) : (
            <div
              id="master-user-form-header"
              className="flex items-center gap-2 h-[50px]"
            >
              <Link
                href="/user-management"
                className="max-w-[35px] max-h-[30px] w-full bg-[#154940] hover:bg-[#0e342d] rounded flex justify-center items-center p-2"
              >
                <BackIcon className="text-white" />
              </Link>

              <div className="font-bold">{title}</div>
            </div>
          )}

          <div className="flex justify-center items-center mr-5">
            <div className="flex items-center gap-x-4 lg:gap-x-6 justify-end ml-5">
              <div
                aria-hidden="true"
                className=" block h-6 w-px lg:bg-gray-900/10"
              />
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  {isLoadingGetUserLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <div className="h-5 w-18 rounded-md bg-gray-200 animate-pulse ml-3"></div>
                          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse ml-4"></div>
                          <div className="ml-2 h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <div
                          aria-hidden="true"
                          className="mr-4 text-sm font-semibold text-gray-900 flex flex-col justify-end items-end"
                        >
                          <p>{dataUser?.username}</p>
                          <p className="text-gray-400 font-light text-xs">
                            {dataUser?.role}
                          </p>
                        </div>

                        <Image
                          src={"/assets/user.png"}
                          alt="avatar"
                          width={100}
                          height={100}
                          className="h-8 w-8 rounded-full bg-gray-50"
                        />
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 text-gray-400"
                        />
                      </div>
                    </>
                  )}
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={"/login"}
                        onClick={() => handleLogout()}
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
