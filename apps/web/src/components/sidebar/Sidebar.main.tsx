"use client";
import { Button } from "@starter/ui/src/components/button";
import { Typography } from "@starter/ui/src/components/typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChartIcon,
  DashboardIcon,
  GearIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import { UserDetails } from "@starter/web/components/sidebar/UserDetails";
import Image from "next/image";

const SIDEBAR_ICON_CLASSNAME = "h-5 w-5 mr-2";
const SIDEBAR_ITEMS = [
  {
    name: "Home",
    href: "/",
    icon: <DashboardIcon className={SIDEBAR_ICON_CLASSNAME} />,
    disabled: false,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: <BarChartIcon className={SIDEBAR_ICON_CLASSNAME} />,
    disabled: true,
  },
  {
    name: "Products",
    href: "/products",
    icon: <Pencil2Icon className={SIDEBAR_ICON_CLASSNAME} />,
    disabled: false,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <GearIcon className={SIDEBAR_ICON_CLASSNAME} />,
    disabled: false,
  },
];

export const Sidebar = () => {
  const pathName = usePathname();

  return (
    <aside
      id="sidebar"
      className="left-0 top-0 z-40 h-screen w-64 transition-transform"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
          <img
            className="h-6 w-6 mr-2"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
            alt="Workflow"
          />
          <Typography.large>Typography</Typography.large>
        </div>
        {SIDEBAR_ITEMS.map((tab) => (
          <Link href={tab.href} key={tab.name}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathName === tab.href ? "bg-accent hover:bg-accent" : ""
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </Button>
          </Link>
        ))}
        <div className="mt-auto flex">
          <UserDetails />
        </div>
      </div>
    </aside>
  );
};
