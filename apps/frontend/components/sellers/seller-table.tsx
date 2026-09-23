"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Seller } from "@/types/seller";

interface SellerTableProps {
  sellers: Seller[];
  onDelete: (seller: Seller) => void;
}

export default function SellerTable({
  sellers,
  onDelete,
}: SellerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white text-slate-950 shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">
              Seller
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">
              Company
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">
              Email
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">
              Phone
            </th>

            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">
              GST Number
            </th>

            <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">
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
                className="border-t border-slate-200 text-slate-950 hover:bg-gray-50"
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
                    <Link
                      href={`/dashboard/sellers/${seller.id}`}
                      className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                    >
                      <Pencil size={18} />
                    </Link>

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
