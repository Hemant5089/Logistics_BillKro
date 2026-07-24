import { Package, Receipt, Truck, Users } from "lucide-react";

const stats = [
  {
    title: "Total Shipments",
    value: "0",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    title: "Total Billing",
    value: "₹0",
    icon: Receipt,
    color: "bg-green-500",
  },
  {
    title: "Total Sellers",
    value: "0",
    icon: Users,
    color: "bg-purple-500",
  },
  {
    title: "Total Carriers",
    value: "0",
    icon: Truck,
    color: "bg-orange-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-gray-500 mt-1">
          Welcome to Logistics BillKro Admin Panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl bg-white border shadow-sm p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>

                <h3 className="text-3xl font-bold mt-2">
                  {item.value}
                </h3>
              </div>

              <div className={`${item.color} p-4 rounded-xl text-white`}>
                <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-white border shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-xl font-semibold">
            Recent Shipments
          </h3>
        </div>

        <div className="p-10 text-center text-gray-500">
          No shipment data available.
        </div>
      </div>
    </div>
  );
}