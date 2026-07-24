"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Truck,
  Users,
  Building2,
  MapPinned,
  FileSpreadsheet,
  Receipt,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Upload Jobs",
    href: "/dashboard/uploads",
    icon: Upload,
  },
  {
    name: "Shipments",
    href: "/dashboard/shipments",
    icon: Truck,
  },
  {
    name: "Sellers",
    href: "/dashboard/sellers",
    icon: Users,
  },
  {
    name: "Carriers",
    href: "/dashboard/carriers",
    icon: Building2,
  },
  {
    name: "Zones",
    href: "/dashboard/zones",
    icon: MapPinned,
  },
  {
    name: "Rate Cards",
    href: "/dashboard/rate-cards",
    icon: FileSpreadsheet,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: Receipt,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">
          BillKro
        </h1>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}