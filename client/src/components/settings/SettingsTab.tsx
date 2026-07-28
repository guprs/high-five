import { useEffect, useState } from "react";
import { Copy, Link2, RefreshCw } from "lucide-react";

import SecuritySection from "./SecuritySection";
import NotificationSection from "./NotificationSection";
import AccessibilitySection from "./AccessibilitySection";
import { getFamilyInviteCode, joinFamily } from "../../services/family";

export default function SettingsTab() {
  const [inviteCode, setInviteCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadInviteCode() {
    try {
      setLoadingInvite(true);
      const data = await getFamilyInviteCode();
      setInviteCode(data.inviteCode);
      setFamilyName(data.familyName);
    } catch {
      setError("We couldn't load your family invite code right now.");
    } finally {
      setLoadingInvite(false);
    }
  }

  async function handleJoinFamily(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoadingJoin(true);
      const data = await joinFamily(joinCode);
      setMessage(`Joined ${data.family.name}!`);
      setJoinCode("");
      setInviteCode(data.family.id.replace(/-/g, "").slice(0, 8).toUpperCase());
      setFamilyName(data.family.name);
    } catch {
      setError("That family code could not be used. Please try again.");
    } finally {
      setLoadingJoin(false);
    }
  }

  useEffect(() => {
    void loadInviteCode();
  }, []);

  return (

    <div
      className="
      space-y-5
      max-w-2xl
      "
    >

      {/* HEADER */}

      <div>

        <h1
          className="
          text-xl
          font-semibold
          text-gray-900
          "
        >
          Settings
        </h1>


        <p
          className="
          text-sm
          text-gray-400
          "
        >
          Manage your account, security and preferences
        </p>

      </div>




      {/* Parent Profile */}
      <div
        className="
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        border
        border-gray-100
        "
      >

        <h3
          className="
          font-semibold
          text-gray-900
          mb-4
          "
        >
          Parent Profile
        </h3>


        <div
          className="
          flex
          items-center
          gap-4
          "
        >

          <div
            className="
            w-16
            h-16
            rounded-2xl
            bg-indigo-100
            flex
            items-center
            justify-center
            text-indigo-700
            font-black
            "
          >
            JS
          </div>


          <div>

            <div
              className="
              font-bold
              text-gray-900
              "
            >
              Jane Smith
            </div>


            <div
              className="
              text-sm
              text-gray-500
              "
            >
              jane@test.com
            </div>


          </div>

        </div>

      </div>




      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Family sharing</h3>
            <p className="mt-1 text-sm text-slate-600">Share a family code with another parent so you can both manage the same family.</p>
          </div>
          <button
            type="button"
            onClick={() => void loadInviteCode()}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {message && <p className="mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}

        <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Your family code</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black tracking-[0.24em] text-slate-900">
              {loadingInvite ? "Loading..." : inviteCode || "—"}
            </div>
            <button
              type="button"
              onClick={() => {
                if (!inviteCode) return;
                navigator.clipboard.writeText(inviteCode);
                setMessage("Family code copied to clipboard.");
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">{familyName ? `Family: ${familyName}` : "Create or join a family to get started."}</p>
        </div>

        <form onSubmit={handleJoinFamily} className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Link2 className="h-4 w-4 text-indigo-600" />
            Join another family
          </div>
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value)}
            placeholder="Enter family code"
            className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={loadingJoin || !joinCode.trim()}
            className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingJoin ? "Joining..." : "Join family"}
          </button>
        </form>
      </div>

      <SecuritySection />


      <NotificationSection />


      <AccessibilitySection />


    </div>

  );

}