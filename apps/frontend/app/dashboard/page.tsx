"use client";

import { useEffect, useState } from "react";

import SellerSearch from "@/components/sellers/seller-search";
import SellerTable from "@/components/sellers/seller-table";
import SellerModal from "@/components/sellers/seller-modal";

import { Seller } from "@/types/seller";
import { SellerService } from "@/services/seller.service";

export default function SellersPage() {
  const [open, setOpen] = useState(false);

  const [sellers, setSellers] = useState<Seller[]>([]);

  const [selectedSeller, setSelectedSeller] =
    useState<Seller | null>(null);

  useEffect(() => {
    loadSellers();
  }, []);

  async function loadSellers() {
    try {
      const data = await SellerService.getAll();
      setSellers(data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleSaveSeller = async (seller: Seller) => {
    try {
      if (selectedSeller) {
        await SellerService.update(selectedSeller.id, seller);
      } else {
        await SellerService.add(seller);
      }

      await loadSellers();

      setOpen(false);
      setSelectedSeller(null);
    } catch (err) {
      console.error(err);
    }
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