"use client";

import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet, UploadCloud } from "lucide-react";

import { CarrierService } from "@/services/carrier.service";
import { SellerService } from "@/services/seller.service";
import {
  CarrierCodSetting,
  RateCardImportError,
  SellerRateCardImportResponse,
  SellerRateCardService,
} from "@/services/seller-rate-card.service";
import { Carrier } from "@/types/carrier";
import { Seller } from "@/types/seller";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }
  }

  return fallback;
}

export default function RateCardsPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  const [uploadSellerId, setUploadSellerId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [carrierCodSettings, setCarrierCodSettings] =
    useState<Record<string, {
      codFixedCharge: string;
      codPercentage: string;
    }>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadResult, setUploadResult] =
    useState<SellerRateCardImportResponse | null>(null);

  const [sourceSellerId, setSourceSellerId] = useState("");
  const [targetSellerIds, setTargetSellerIds] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [copyError, setCopyError] = useState("");

  const targetSellers = useMemo(
    () =>
      sellers.filter(
        (seller) => seller.id !== sourceSellerId,
      ),
    [sellers, sourceSellerId],
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [sellerData, carrierData] =
          await Promise.all([
            SellerService.getAll(),
            CarrierService.getAll(),
          ]);

        setSellers(sellerData);
        setCarriers(carrierData);
        setCarrierCodSettings(
          carrierData.reduce<
            Record<string, {
              codFixedCharge: string;
              codPercentage: string;
            }>
          >((settings, carrier) => {
            settings[carrier.id] = {
              codFixedCharge: "30",
              codPercentage: "1.9",
            };

            return settings;
          }, {}),
        );
      } catch (error) {
        console.error(error);
        setUploadError("Failed to load sellers and carriers.");
      }
    }

    loadData();
  }, []);

  function updateCarrierCodSetting(
    carrierId: string,
    field: "codFixedCharge" | "codPercentage",
    value: string,
  ) {
    setCarrierCodSettings((current) => ({
      ...current,
      [carrierId]: {
        codFixedCharge:
          current[carrierId]?.codFixedCharge ?? "30",
        codPercentage:
          current[carrierId]?.codPercentage ?? "1.9",
        [field]: value,
      },
    }));
  }

  function toggleTargetSeller(sellerId: string) {
    setTargetSellerIds((current) =>
      current.includes(sellerId)
        ? current.filter((id) => id !== sellerId)
        : [...current, sellerId],
    );
  }

  async function handleUpload() {
    setUploadError("");
    setUploadResult(null);

    if (!uploadSellerId) {
      setUploadError("Please select a seller first.");
      return;
    }

    if (!file) {
      setUploadError("Please choose an Excel file.");
      return;
    }

    const parsedCarrierCodSettings: CarrierCodSetting[] =
      carriers.map((carrier) => {
        const setting = carrierCodSettings[carrier.id];

        return {
          carrierId: carrier.id,
          codFixedCharge: Number(
            setting?.codFixedCharge ?? "30",
          ),
          codPercentage: Number(
            setting?.codPercentage ?? "1.9",
          ),
        };
      });

    const invalidCarrier = parsedCarrierCodSettings.find(
      (setting) =>
        Number.isNaN(setting.codFixedCharge) ||
        Number.isNaN(setting.codPercentage) ||
        Number(setting.codFixedCharge) < 0 ||
        Number(setting.codPercentage) < 0,
    );

    if (invalidCarrier) {
      setUploadError(
        "Enter valid COD charge and COD percentage for every carrier.",
      );
      return;
    }

    try {
      setUploading(true);

      const response =
        await SellerRateCardService.importExcel(
          uploadSellerId,
          file,
          {
            carrierCodSettings:
              parsedCarrierCodSettings,
          },
        );

      setUploadResult(response);
      setFile(null);
    } catch (error) {
      console.error(error);
      setUploadError(
        getErrorMessage(
          error,
          "Rate card upload failed.",
        ),
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleCopy() {
    setCopyError("");
    setCopyMessage("");

    if (!sourceSellerId) {
      setCopyError("Please select the seller to copy from.");
      return;
    }

    if (targetSellerIds.length === 0) {
      setCopyError("Please select at least one target seller.");
      return;
    }

    try {
      setCopying(true);

      const response =
        await SellerRateCardService.copySellerRateCards(
          sourceSellerId,
          targetSellerIds,
        );

      setCopyMessage(
        `Copied ${response.copied} rate card rows to ${targetSellerIds.length} seller(s).`,
      );
    } catch (error) {
      console.error(error);
      setCopyError(
        getErrorMessage(
          error,
          "Failed to copy seller rate cards.",
        ),
      );
    } finally {
      setCopying(false);
    }
  }

  function renderImportError(
    error: RateCardImportError,
    index: number,
  ) {
    return (
      <tr key={index} className="border-t border-slate-200">
        <td className="px-4 py-3 text-sm font-medium text-slate-900">
          {index + 1}
        </td>
        <td className="px-4 py-3 text-sm text-red-700">
          {error.reason}
        </td>
        <td className="px-4 py-3 text-sm text-slate-700">
          <pre className="max-w-xl whitespace-pre-wrap break-words font-sans">
            {JSON.stringify(error.row ?? {}, null, 2)}
          </pre>
        </td>
      </tr>
    );
  }

  return (
    <div className="space-y-6 text-slate-950">
      <div>
        <h1 className="text-3xl font-bold">
          Rate Cards
        </h1>

        <p className="text-slate-600">
          Upload seller rate cards and copy rates between sellers.
        </p>
      </div>

      <section className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UploadCloud size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Upload Seller Rate Card
            </h2>
            <p className="text-sm text-slate-600">
              Select a seller, then upload the Excel file for only that seller.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Seller
            </label>

            <select
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
              value={uploadSellerId}
              onChange={(event) =>
                setUploadSellerId(event.target.value)
              }
            >
              <option value="">Select Seller</option>

              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.sellerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Excel File
            </label>

            <input
              type="file"
              accept=".xlsx,.xls"
              disabled={uploading}
              onChange={(event) =>
                setFile(event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-950 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">
            Carrier COD Settings
          </h3>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                    COD Charge
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                    COD Percentage
                  </th>
                </tr>
              </thead>

              <tbody>
                {carriers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No carriers found.
                    </td>
                  </tr>
                ) : (
                  carriers.map((carrier) => (
                    <tr
                      key={carrier.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-3 font-medium">
                        {carrier.name}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            carrierCodSettings[carrier.id]
                              ?.codFixedCharge ?? "30"
                          }
                          onChange={(event) =>
                            updateCarrierCodSetting(
                              carrier.id,
                              "codFixedCharge",
                              event.target.value,
                            )
                          }
                          className="w-40 rounded-lg border border-slate-300 p-2 text-slate-950 focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            carrierCodSettings[carrier.id]
                              ?.codPercentage ?? "1.9"
                          }
                          onChange={(event) =>
                            updateCarrierCodSetting(
                              carrier.id,
                              "codPercentage",
                              event.target.value,
                            )
                          }
                          className="w-40 rounded-lg border border-slate-300 p-2 text-slate-950 focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {uploadError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {uploadResult && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  Total Rows
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {uploadResult.totalRows}
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-700">
                  Imported
                </p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {uploadResult.imported}
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-700">
                  Skipped
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-700">
                  {uploadResult.skipped}
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Errors
                </p>
                <p className="mt-1 text-2xl font-bold text-red-700">
                  {uploadResult.errors.length}
                </p>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Issue
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Row Data
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {uploadResult.errors.map(renderImportError)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading..."
            : "Upload Seller Rate Card"}
        </button>
      </section>

      <section className="rounded-xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FileSpreadsheet size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Copy Seller Rate Card
            </h2>
            <p className="text-sm text-slate-600">
              Copy one seller's existing rate cards to one or more sellers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-medium">
              Copy From Seller
            </label>

            <select
              className="w-full rounded-lg border border-slate-300 p-3 text-slate-950 focus:border-blue-500 focus:outline-none"
              value={sourceSellerId}
              onChange={(event) => {
                setSourceSellerId(event.target.value);
                setTargetSellerIds([]);
              }}
            >
              <option value="">
                Select Seller
              </option>

              {sellers.map((seller) => (
                <option
                  key={seller.id}
                  value={seller.id}
                >
                  {seller.sellerName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Apply To Sellers
            </label>

            <div className="max-h-52 overflow-auto rounded-lg border border-slate-300 p-3">
              {targetSellers.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Select a source seller first.
                </p>
              ) : (
                targetSellers.map((seller) => (
                  <label
                    key={seller.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={targetSellerIds.includes(
                        seller.id,
                      )}
                      onChange={() =>
                        toggleTargetSeller(seller.id)
                      }
                      className="h-4 w-4"
                    />

                    <span>{seller.sellerName}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {copyError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {copyError}
          </div>
        )}

        {copyMessage && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {copyMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleCopy}
          disabled={copying}
          className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copying
            ? "Copying..."
            : "Copy Rate Cards"}
        </button>
      </section>
    </div>
  );
}
