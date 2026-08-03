"use client";

import { Carrier } from "@/types/carrier";

interface CarrierTableProps {
  carriers: Carrier[];
}

export default function CarrierTable({
  carriers,
}: CarrierTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Carrier Name
            </th>

            <th className="px-6 py-3 text-center text-sm font-semibold">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {carriers.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="py-10 text-center text-gray-500"
              >
                No carriers found.
              </td>
            </tr>
          ) : (
            carriers.map((carrier) => (
              <tr
                key={carrier.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {carrier.name}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      carrier.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {carrier.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}