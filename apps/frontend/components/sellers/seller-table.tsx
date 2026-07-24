"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Seller } from "@/types/seller";

interface SellerTableProps {
  sellers: Seller[];
  onEdit: (seller: Seller) => void;
  onDelete: (seller: Seller) => void;
}

export default function SellerTable({
  sellers,
  onEdit,
  onDelete,
}: SellerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Seller
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Company
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Email
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold">
              GST Number
            </th>

            <th className="px-6 py-3 text-center text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {sellers.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                No sellers found.
              </td>
            </tr>
          ) : (
            sellers.map((seller) => (
              <tr
                key={seller.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {seller.sellerName}
                </td>

                <td className="px-6 py-4">
                  {seller.companyName}
                </td>

                <td className="px-6 py-4">
                  {seller.email}
                </td>

                <td className="px-6 py-4">
                  {seller.phone}
                </td>

                <td className="px-6 py-4">
                  {seller.gstNumber}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(seller)}
                      className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(seller)}
                      className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}