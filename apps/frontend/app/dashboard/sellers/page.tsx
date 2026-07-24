"use client";

import { useEffect, useState } from "react";
import SellerSearch from "@/components/sellers/seller-search";
import SellerTable from "@/components/sellers/seller-table";
import SellerModal from "@/components/sellers/seller-modal";
import { Seller } from "@/types/seller";
import { SellerService } from "@/services/seller.service";

export default function SellersPage() {
  const [open, setOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const refreshSellers = async () => {
    try {
      const data = await SellerService.getAll();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setSellers([]);
    }
  };

  useEffect(() => {
    refreshSellers();
  }, []);

  const handleAddSeller = () => {
    setSelectedSeller(null);
    setOpen(true);
  };

  const handleEditSeller = (seller: Seller) => {
    setSelectedSeller(seller);
    setOpen(true);
  };

  const handleSaveSeller = async (seller: Seller) => {
    try {
      const { id, ...payload } = seller;

      if (id && id.trim() !== "") {
        await SellerService.update(id, payload);
      } else {
        await SellerService.add(payload);
      }

      await refreshSellers();

      setOpen(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save seller.");
    }
  };

  const handleDeleteSeller = async (seller: Seller) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${seller.sellerName}"?`
    );

    if (!confirmed) return;

    try {
      await SellerService.delete(seller.id);
      await refreshSellers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete seller.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Sellers
        </h1>

        <p className="text-gray-500">
          Manage all registered sellers.
        </p>
      </div>

      <SellerSearch onAdd={handleAddSeller} />

      <SellerTable
        sellers={sellers}
        onEdit={handleEditSeller}
        onDelete={handleDeleteSeller}
      />

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