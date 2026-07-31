import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  approveRewardRequest,
  getRewardRequests,
  rejectRewardRequest,
  type ApiRewardRequest,
} from "../../services/rewards";

export default function RewardRequests() {
  const [requests, setRequests] = useState<ApiRewardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setError("");
        setRequests(await getRewardRequests("pending"));
      } catch {
        setError("Could not load reward requests.");
      } finally {
        setLoading(false);
      }
    }

    void loadRequests();
  }, []);

  async function resolveRequest(id: string, action: "approve" | "reject") {
    try {
      setActionId(id);
      setError("");
      if (action === "approve") {
        await approveRewardRequest(id);
      } else {
        await rejectRewardRequest(id);
      }
      setRequests((current) => current.filter((request) => request.id !== id));
    } catch {
      setError(`Could not ${action} this request.`);
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">Reward Requests</h3>
        {requests.length > 0 && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
            {requests.length}
          </span>
        )}
      </div>

      {error && (
        <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-xs text-gray-400">Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="py-7 text-center">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
          <p className="text-sm font-medium text-gray-500">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.slice(0, 3).map((request) => {
            const busy = actionId === request.id;
            return (
              <article
                key={request.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3.5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">{request.childEmoji || "🧒"}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900">
                      {request.childName || "Child"}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(request.requestedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-700">
                  {request.reward || "Reward"}
                </p>
                <p className="mb-3 text-xs font-bold text-amber-600">
                  ⭐ {request.cost ?? 0} coins
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void resolveRequest(request.id, "approve")}
                    className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {busy ? "Working..." : "✓ Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void resolveRequest(request.id, "reject")}
                    className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
                  >
                    ✗ Decline
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
