import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Copy,
  Link2,
  RefreshCw,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  getFamilyInviteCode,
  getFamilyMembers,
  joinFamily,
  type FamilyMember,
} from "../../services/family";

export default function FamilySharingPanel() {
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [membersError, setMembersError] = useState("");
  const [joinNotice, setJoinNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    let knownMemberIds: Set<string> | null = null;
    let knownFamilyId = "";

    function currentFamilyId() {
      try {
        return (
          JSON.parse(localStorage.getItem("family") ?? "{}") as { id?: string }
        ).id ?? "";
      } catch {
        return "";
      }
    }

    async function pollMembers() {
      const familyId = currentFamilyId();
      if (familyId !== knownFamilyId) {
        knownFamilyId = familyId;
        knownMemberIds = null;
      }

      try {
        const nextMembers = await getFamilyMembers();
        if (cancelled) return;

        if (knownMemberIds) {
          const newMembers = nextMembers.filter(
            (member) => !knownMemberIds?.has(member.id),
          );
          if (newMembers.length > 0) {
            setJoinNotice(
              `${newMembers.map((member) => member.name).join(", ")} joined your family.`,
            );
            const invite = await getFamilyInviteCode();
            if (!cancelled) {
              setInviteCode(invite.inviteCode);
              setFamilyName(invite.familyName);
            }
          }
        }

        knownMemberIds = new Set(nextMembers.map((member) => member.id));
        setMembers(nextMembers);
        setMembersError("");
      } catch {
        if (!cancelled) {
          setMembersError("Connected family members could not be loaded.");
        }
      }
    }

    void pollMembers();
    const pollId = window.setInterval(() => void pollMembers(), 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(pollId);
    };
  }, []);

  async function loadInviteCode() {
    try {
      setLoadingInvite(true);
      setError("");
      const data = await getFamilyInviteCode();
      setInviteCode(data.inviteCode);
      setFamilyName(data.familyName);
    } catch {
      setError("We couldn't load your family invite code right now.");
    } finally {
      setLoadingInvite(false);
    }
  }

  async function togglePanel() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && !inviteCode) await loadInviteCode();
  }

  async function copyCode() {
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
      setFamilyName(data.family.name);
      setJoinCode("");
      setMembers(await getFamilyMembers());
      await loadInviteCode();
    } catch (joinError: unknown) {
      setError(
        (typeof joinError === "object" &&
        joinError !== null &&
        "response" in joinError
          ? (joinError.response as { data?: { message?: string } }).data?.message
          : undefined) ??
          "That family code could not be used. Please try again.",
      );
    } finally {
      setLoadingJoin(false);
    }
  }

  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => void togglePanel()}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-4 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <Users className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900">
            Family account access
          </div>
          <div className="text-xs text-gray-400">
            Invite a trusted family member or join an existing family
          </div>
        </div>
        <span className="text-sm font-semibold text-indigo-600">
          {open ? "Close" : "Manage"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {joinNotice && (
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="flex-1">{joinNotice}</span>
          <button
            type="button"
            onClick={() => setJoinNotice("")}
            aria-label="Dismiss family notification"
            className="text-emerald-500 hover:text-emerald-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {open && (
        <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Manage family access
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Codes should only be shared with trusted family members.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close family access"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {message && (
            <p className="mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-xl bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </p>
          )}

          <div className="dark-surface mt-4 rounded-xl border border-white bg-white/80 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                Your private family code
              </p>
              <button
                type="button"
                onClick={() => void loadInviteCode()}
                disabled={loadingInvite}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${loadingInvite ? "animate-spin" : ""}`}
                />
                Reload code
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="dark-code rounded-xl bg-gray-50 px-3 py-2 text-base font-black tracking-[0.2em] text-gray-900">
                {loadingInvite ? "Loading…" : inviteCode || "—"}
              </code>
              <button
                type="button"
                onClick={() => void copyCode()}
                disabled={!inviteCode}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            {familyName && (
              <p className="mt-2 text-xs text-gray-500">Family: {familyName}</p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
              This code remains active until someone uses it. After a
              successful join, a new code is generated automatically.
            </p>
          </div>

          <form
            onSubmit={handleJoinFamily}
            className="dark-surface mt-3 rounded-xl border border-white bg-white/80 p-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Link2 className="h-3.5 w-3.5 text-indigo-600" />
              Join another family
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                value={joinCode}
                onChange={(event) => setJoinCode(event.target.value)}
                placeholder="Enter family code"
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={loadingJoin || !joinCode.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loadingJoin ? "Joining…" : "Join family"}
              </button>
            </div>
          </form>

          <div className="dark-surface mt-3 rounded-xl border border-white bg-white/80 p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">
                Connected family members
              </h4>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                {members.length}
              </span>
            </div>
            {membersError ? (
              <p className="mt-2 text-xs font-medium text-rose-600">
                {membersError}
              </p>
            ) : members.length > 0 ? (
              <div className="mt-2 divide-y divide-gray-100">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 py-2"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                      <UserRound className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="truncate text-[11px] text-gray-400">
                        {member.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">
                No connected family members found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
