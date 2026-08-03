"use client";

import { useEffect, useState } from "react";
import { Carrier } from "@/types/carrier";
import { CarrierService } from "@/services/carrier.service";
import CarrierTable from "@/components/carriers/carrier-table";
import CarrierModal from "@/components/carriers/carrier-modal";

export default function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [open, setOpen] = useState(false);

  const loadCarriers = async () => {
    try {
      const data = await CarrierService.getAll();
      setCarriers(data);
    } catch (error) {
      console.error("Failed to load carriers:", error);
    }
  };

  useEffect(() => {
    loadCarriers();
  }, []);

  const handleSave = async (carrier: Carrier) => {
    try {
      await CarrierService.add({
        name: carrier.name,
      });

      setOpen(false);
      loadCarriers();
    } catch (error) {
      console.error("Failed to add carrier:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Carriers</h1>
          <p className="text-gray-500">
            Manage logistics carriers.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Carrier
        </button>
      </div>

      <CarrierTable carriers={carriers} />

      <CarrierModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}