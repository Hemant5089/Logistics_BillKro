"use client";

import { useState } from "react";
import SellerSearch from "@/components/sellers/seller-search";
import SellerTable from "@/components/sellers/seller-table";
import SellerModal from "@/components/sellers/seller-modal";
import { Seller } from "@/types/Seller";
import { SellerService } from "@/services/seller.service";

export default function SellersPage() {
  const [open, setOpen] = useState(false);

  const [sellers, setSellers] = useState<Seller[]>(
    SellerService.getAll()
  );

  const [selectedSeller, setSelectedSeller] =
    useState<Seller | null>(null);

  const handleSaveSeller = (seller: Seller) => {
    if (selectedSeller) {
      // Edit existing seller
      SellerService.update(seller);
    } else {
      // Add new seller
      SellerService.add(seller);
    }

    setSellers([...SellerService.getAll()]);
    setOpen(false);
    setSelectedSeller(null);
  };

  const handleEditSeller = (seller: Seller) => {
    setSelectedSeller(seller);
    setOpen(true);
  };

  const handleAddSeller = () => {
    setSelectedSeller(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Sellers
        </h1>

        <p className="text-gray-500">
          Manage all registered sellers.
        </p>
      </div>

      {/* Search */}
      <SellerSearch onAdd={handleAddSeller} />

      {/* Table */}
      <SellerTable
        sellers={sellers}
        onEdit={handleEditSeller}
      />

      {/* Modal */}
      <SellerModal
        open={open}
        seller={selectedSeller}
        onClose={() => {
          setOpen(false);
          setSelectedSeller(null);
        }}
        onSave={handleSaveSeller}
      />
    </div>
  );
}