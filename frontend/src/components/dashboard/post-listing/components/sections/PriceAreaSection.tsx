"use client";

import { DollarSign, Info } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
  SelectDropdown,
  Toggle,
} from "@/components/dashboard/post-listing/components/ui";
import {
  AREA_UNITS,
  CURRENCIES,
} from "@/components/dashboard/post-listing/constants";

interface Props {
  areaSize: string;
  setAreaSize: (v: string) => void;
  areaUnit: string;
  setAreaUnit: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  installment: boolean;
  setInstallment: (v: boolean) => void;
  readyForPossession: boolean;
  setReadyForPossession: (v: boolean) => void;
}

const inputCls =
  "flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 transition-all";

export function PriceAreaSection({
  areaSize,
  setAreaSize,
  areaUnit,
  setAreaUnit,
  price,
  setPrice,
  currency,
  setCurrency,
  installment,
  setInstallment,
  readyForPossession,
  setReadyForPossession,
}: Props) {
  const formatPrice = () => {
    if (!price || currency !== "PKR") return null;
    const n = Number(price);
    if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(2)} Crore`;
    if (n >= 100_000) return `${(n / 100_000).toFixed(2)} Lakh`;
    return null;
  };

  return (
    <SectionCard>
      <SectionHeader
        step={2}
        label="Price and Area"
        icon={<DollarSign className="w-6 h-6" />}
      />

      {/* Area Size */}
      <div className="mb-6">
        <FieldLabel>Area Size</FieldLabel>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter area size"
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            className={inputCls}
            min={0}
          />
          <div className="w-40">
            <SelectDropdown
              value={areaUnit}
              onChange={setAreaUnit}
              options={AREA_UNITS}
            />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <FieldLabel>Price</FieldLabel>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputCls}
            min={0}
          />
          <div className="w-40">
            <SelectDropdown
              value={currency}
              onChange={setCurrency}
              options={CURRENCIES}
              disabled={true}
            />
          </div>
        </div>
        {formatPrice() && (
          <p className="mt-2 text-sm text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> {formatPrice()}
          </p>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-0">
        {[
          {
            label: "Installment Available",
            desc: "Enable if listing is available on installments",
            val: installment,
            set: setInstallment,
          },
          {
            label: "Ready for Possession",
            desc: "Enable if listing is ready for possession",
            val: readyForPossession,
            set: setReadyForPossession,
          },
        ].map(({ label, desc, val, set }) => (
          <div
            key={label}
            className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800"
          >
            <div>
              <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">
                {label}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
            </div>
            <Toggle checked={val} onChange={set} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
