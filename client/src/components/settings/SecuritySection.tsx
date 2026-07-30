import { useState } from "react";
import { Lock } from "lucide-react";

import ChangePasswordModal from "./ChangePasswordModal";
import FamilyPinCard from "./FamilyPinCard";
import FamilySharingPanel from "./FamilySharingPanel";

export default function SecuritySection() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-900">
        Security & Family Access
      </h2>
      <p className="mb-3 text-xs text-gray-400">
        Manage passwords, family access, and protected Kid Mode controls
      </p>

      <div className="flex items-center gap-3 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Lock className="h-5 w-5 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900">
            Parent account password
          </div>
          <div className="text-xs text-gray-400">
            Protects login and parent account access
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Change
        </button>
      </div>

      <FamilySharingPanel />
      <FamilyPinCard />
      </section>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
}
