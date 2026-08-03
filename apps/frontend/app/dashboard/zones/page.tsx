"use client";

import { useEffect, useState } from "react";
import { Zone } from "@/types/zone";
import { ZoneService } from "@/services/zone.service";
import ZoneTable from "@/components/zones/zone-table";
import ZoneModal from "@/components/zones/zone-modal";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [open, setOpen] = useState(false);

  const loadZones = async () => {
    try {
      const data = await ZoneService.getAll();
      setZones(data);
    } catch (error) {
      console.error("Failed to load zones:", error);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleSave = async (zone: Zone) => {
    try {
      await ZoneService.add({
        name: zone.name,
      });

      setOpen(false);
      loadZones();
    } catch (error) {
      console.error("Failed to add zone:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Zones
          </h1>

          <p className="text-gray-500">
            Manage delivery zones.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Zone
        </button>
      </div>

      <ZoneTable zones={zones} />

      <ZoneModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}