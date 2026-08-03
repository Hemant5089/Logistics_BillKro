"use client";

import { Zone } from "@/types/zone";

interface ZoneTableProps {
  zones: Zone[];
}

export default function ZoneTable({
  zones,
}: ZoneTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Zone Name
            </th>

            <th className="px-6 py-3 text-center text-sm font-semibold">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {zones.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="py-10 text-center text-gray-500"
              >
                No zones found.
              </td>
            </tr>
          ) : (
            zones.map((zone) => (
              <tr
                key={zone.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {zone.name}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      zone.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {zone.isActive ? "Active" : "Inactive"}
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