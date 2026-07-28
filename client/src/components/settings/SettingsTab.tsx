import { useEffect, useState } from "react";
import { Copy, Link2, RefreshCw } from "lucide-react";

import AccessibilitySection from "./AccessibilitySection";
import NotificationSection from "./NotificationSection";
import SecuritySection from "./SecuritySection";
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

  useEffect(() => {
    void loadInviteCode();
  }, []);

  async function handleCopyCode() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setMessage("Family code copied to clipboard.");
      setError("");
    } catch {
      setError("Copy failed. Please copy the code manually.");
    }
  }

  async function handleJoinFamily(event: React.FormEvent) {
    event.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setLoadingJoin(true);
      setError("");
      const data = await joinFamily(joinCode);
      setMessage(data.message ?? `Joined ${data.family.name}!`);
      setJoinCode("");
      await loadInviteCode();
    } catch (joinError: unknown) {
      setError(
        (typeof joinError === "object" && joinError !== null && "response" in joinError
          ? (joinError.response as { data?: { message?: string } }).data?.message
          : undefined) ?? "That family code could not be used. Please try again.",
      );
    } finally {
      setLoadingJoin(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account, security and preferences</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Parent Profile</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 font-black text-indigo-700">JS</div>
          <div><div className="font-bold text-gray-900">Jane Smith</div><div className="text-sm text-gray-500">jane@test.com</div></div>
        </div>
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Family sharing</h3>
            <p className="mt-1 text-sm text-slate-600">Share a family code with another parent so you can both manage the same family.</p>
          </div>
          <button type="button" onClick={() => void loadInviteCode()} disabled={loadingInvite} className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60"><RefreshCw className="h-4 w-4" />Refresh</button>
        </div>

        {message && <p className="mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p>}

        <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Your family code</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black tracking-[0.24em] text-slate-900">{loadingInvite ? "Loading..." : inviteCode || "—"}</div>
            <button type="button" onClick={() => void handleCopyCode()} disabled={!inviteCode} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"><Copy className="h-4 w-4" />Copy</button>
          </div>
          <p className="mt-2 text-sm text-slate-600">{familyName ? `Family: ${familyName}` : "Create or join a family to get started."}</p>
        </div>

        <form onSubmit={handleJoinFamily} className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900"><Link2 className="h-4 w-4 text-indigo-600" />Join another family</div>
          <input value={joinCode} onChange={(event) => setJoinCode(event.target.value)} placeholder="Enter family code" className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
          <button type="submit" disabled={loadingJoin || !joinCode.trim()} className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">{loadingJoin ? "Joining..." : "Join family"}</button>
        </form>
      </section>

      <SecuritySection />
      <NotificationSection />
      <AccessibilitySection />
    </div>
  );
}
