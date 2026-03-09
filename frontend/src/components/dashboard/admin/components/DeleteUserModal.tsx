"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import type { UserRecord } from "../types";

interface Props {
  user: UserRecord;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteUserModal({ user, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: 200 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-[16px]">
              Delete User Account
            </h3>
            <p className="text-[13px] text-slate-500 mt-0.5">
              This will permanently delete <strong>{user.name}</strong> and all
              their listings.
            </p>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-rose-700 dark:text-rose-400 font-medium">
              This action cannot be undone. All property listings, data, and
              account information will be permanently erased.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
