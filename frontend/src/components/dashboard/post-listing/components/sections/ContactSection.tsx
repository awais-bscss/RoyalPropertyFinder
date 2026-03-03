"use client";

import { Mail, Phone, PhoneCall, Plus, X } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
} from "@/components/dashboard/post-listing/components/ui";

interface Props {
  contactEmail: string;
  setContactEmail: (v: string) => void;
  mobileNumbers: Array<string | undefined>;
  addMobileNumber: () => void;
  updateMobileNumber: (idx: number, val: string | undefined) => void;
  removeMobileNumber: (idx: number) => void;
  landline: string | undefined;
  setLandline: (v: string | undefined) => void;
}

// Shared class for the PhoneInput wrapper border box
const phoneWrapCls =
  "w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-royal-600/30 focus-within:border-royal-600 transition-all rpf-pl-contact";

export function ContactSection({
  contactEmail,
  setContactEmail,
  mobileNumbers,
  addMobileNumber,
  updateMobileNumber,
  removeMobileNumber,
  landline,
  setLandline,
}: Props) {
  return (
    <SectionCard>
      <SectionHeader
        step={6}
        label="Contact Information"
        icon={<Phone className="w-6 h-6" />}
      />

      {/* Email */}
      <div className="mb-6">
        <FieldLabel>
          <Mail className="w-5 h-5 text-royal-600" /> Email
        </FieldLabel>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 transition-all"
        />
      </div>

      {/* Mobile */}
      <div className="mb-6">
        <FieldLabel>
          <Phone className="w-5 h-5 text-royal-600" /> Mobile
        </FieldLabel>
        <div className="space-y-3">
          {mobileNumbers.map((num, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={phoneWrapCls}>
                <PhoneInput
                  placeholder="3XX XXXXXXX"
                  value={num}
                  onChange={(val) => updateMobileNumber(idx, val)}
                  defaultCountry="PK"
                  international
                  countryCallingCodeEditable={false}
                  className="rpf-phone-input"
                />
              </div>
              {idx === mobileNumbers.length - 1 ? (
                <button
                  type="button"
                  onClick={addMobileNumber}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:border-royal-400 hover:text-royal-700 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeMobileNumber(idx)}
                  className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Landline */}
      <div>
        <FieldLabel>
          <PhoneCall className="w-5 h-5 text-royal-600" /> Landline{" "}
          <span className="text-sm text-slate-400 font-normal">(optional)</span>
        </FieldLabel>
        <div className={phoneWrapCls}>
          <PhoneInput
            placeholder="XX XXXXXXX"
            value={landline}
            onChange={setLandline}
            defaultCountry="PK"
            international
            countryCallingCodeEditable={false}
            className="rpf-phone-input"
          />
        </div>
      </div>

      {/* Scoped styles matching SignUpModal's rpf-phone-input */}
      <style jsx global>{`
        .rpf-pl-contact .rpf-phone-input {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .rpf-pl-contact .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .rpf-pl-contact .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .rpf-pl-contact .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .rpf-pl-contact .PhoneInputCountrySelectArrow {
          width: 6px;
          height: 6px;
          border-color: #94a3b8;
          border-style: solid;
          border-top-width: 0;
          border-right-width: 2px;
          border-bottom-width: 2px;
          border-left-width: 0;
          transform: rotate(45deg);
          margin-top: -3px;
          margin-left: 3px;
          opacity: 0.6;
        }
        .rpf-pl-contact .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          font-weight: 500;
          color: #334155;
          background: transparent;
          padding: 4px 0;
        }
        .dark .rpf-pl-contact .PhoneInputInput {
          color: #e2e8f0;
        }
        .rpf-pl-contact .PhoneInputInput::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </SectionCard>
  );
}
