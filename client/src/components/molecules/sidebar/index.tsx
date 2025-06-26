"use client";
import { HomeIcon } from "@/assets/svg/home-icon";
import { InquiryIcon } from "@/assets/svg/inquiry-icon";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import CLink from "@/components/atoms/link";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const selectedMenu = (path: string) => {
    if (path === "/inquiry") {
      return pathname.includes(path) && !pathname.includes("/inquiry-approval");
    }
    return pathname.includes(path);
  };

  const handleShowSidebar = useMemo(() => {
    return (
      <>
        <div className="w-full">
          <MenuItems
            Icon={HomeIcon}
            title="Dashboard"
            selected={selectedMenu("/dashboard")}
            href="/dashboard"
          />
          <MenuItems
            title="Material Management"
            href="/material-management/material-list"
            Icon={InquiryIcon}
            selected={
              selectedMenu("/material-management/material-list") ||
              selectedMenu("/material-management/completed") ||
              selectedMenu("/material-management/request-material")
            }
          />
          <SubMenuItems
            title="Raw Material"
            selected={selectedMenu("/material-management/material-list")}
            href="/material-management/material-list"
            hide={!selectedMenu("/material-management")}  
          />
          <SubMenuItems
            title="Completed Request Material"
            selected={selectedMenu("/material-management/completed")}
            href="/material-management/completed"
            hide={!selectedMenu("/material-management")}
          />
          <SubMenuItems
            title="Request & Approval Material"
            selected={selectedMenu("/material-management/request-material")}
            href="/material-management/request-material"
            hide={!selectedMenu("/material-management")}
          />
          <MenuItems
            title="Stock Management"
            href="/stock-management/stock-material"
            Icon={InquiryIcon}
            selected={
              selectedMenu("/stock-management/stock-material") ||
              selectedMenu("/stock-management/request")
            }
          />
          <SubMenuItems
            title="Available Stock"
            selected={selectedMenu("/stock-management/stock-material")}
            href="/stock-management/stock-material"
            hide={!selectedMenu("/stock-management")}
          />
          <SubMenuItems
            title="Input & Approval Stock"
            selected={selectedMenu("/stock-management/request")}
            href="/stock-management/request"
            hide={!selectedMenu("/stock-management")}
          />
          <MenuItems
            title="User Management"
            href="/user-management"
            Icon={InquiryIcon}
            selected={selectedMenu("/user-management")}
          />
        </div>
      </>
    );
  }, [selectedMenu]);
  return (
    <>
      <div className="hidden h-screen lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex shrink-0 bg-[#0e342d] border-b border-gray-500 shadow-xl items-center p-1">
          <Image
            src="/assets/logoWhite.png"
            alt="Logo KPP Mining"
            width={80}
            height={80}
            className="p-3"
          />
          <p className="text-white font-medium">Material Management</p>
        </div>
        <div className="bg-[#0e342d] h-screen border-gray-500 shadow-xl items-center p-1">
          {handleShowSidebar}
        </div>
      </div>
    </>
  );
};
export default Sidebar;

type TMenuItemProps = {
  selected: boolean;
  title: string;
  Icon: React.FC<{ fill?: boolean }>;
  href?: string;
};

const MenuItems: React.FC<TMenuItemProps> = ({
  selected,
  title,
  Icon,
  href,
}) => {
  return (
    <CLink href={href ? href : ""} prefetch>
      <div
        className={`group flex hover:bg-[#CCE1E0] rounded-sm p-3 gap-2 items-center cursor-pointer ${
          selected ? "bg-[#CCE1E0]" : ""
        }`}
      >
        <Icon fill={selected} />
        <small
          className={`font-bold ${
            selected
              ? "text-[#006766]"
              : "text-white group-hover:text-[#006766]"
          }`}
        >
          {title}
        </small>
      </div>
    </CLink>
  );
};
type TSubMenuProps = {
  selected?: boolean;
  title?: string;
  hide?: boolean;
  href?: string;
  Icon?: React.FC<{ fill?: boolean }>;
};
const SubMenuItems: React.FC<TSubMenuProps> = ({
  selected,
  title,
  hide,
  href,
  Icon,
}) => {
  return (
    <CLink href={href ? href : ""} prefetch>
      <div
        className={`group flex text-[#006766] rounded-sm hover:bg-[#CCE1E0] p-3 gap-2 items-center cursor-pointer ${
          selected ? "bg-[#CCE1E0]" : ""
        } ${hide ? "hidden" : ""}`}
      >
        {Icon && <Icon fill={selected} />}
        <small
          className={`font-bold ${
            selected
              ? "text-[#006766]"
              : "text-white group-hover:text-[#006766]"
          } ${Icon ? "" : "pl-[24px] ml-2"}`}
        >
          {title}
        </small>
      </div>
    </CLink>
  );
};
