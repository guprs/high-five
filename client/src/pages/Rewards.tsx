import axios from "axios";
import { useEffect, useState } from "react";
import { CheckCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import DeleteRewardModal from "../components/rewards/DeleteRewardModal";
import RewardModal from "../components/rewards/RewardModal";
import {
  approveRewardRequest,
  createReward,
  deleteReward,
  getRewardRequests,
  getRewards,
  rejectRewardRequest,
  updateReward,
  type ApiRewardRequest,
} from "../services/rewards";
import type { Reward } from "../types/dashboard";

function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

function formatRequestDate(value?: string | null) {
  if (!value) return "Recently";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function RewardsPage() {
  const [pending, setPending] = useState<ApiRewardRequest[]>([]);
  const [history, setHistory] = useState<ApiRewardRequest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestActionId, setRequestActionId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function loadRewardsPage() {
    try {
      setLoading(true);
      setError("");
      const [catalog, requests] = await Promise.all([
        getRewards(),
        getRewardRequests(),
      ]);
      setRewards(
        catalog.map((reward) => ({
          id: reward.id,
          title: reward.title,
          cost: reward.cost,
          icon: reward.icon || "🎁",
        })),
      );
      setPending(requests.filter((request) => request.status === "pending"));
      setHistory(requests.filter((request) => request.status !== "pending"));
    } catch (loadError) {
      setError(errorMessage(loadError, "We couldn’t load rewards right now."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadRewardsPage);
  }, []);

  function openCreateModal() {
    setEditingReward(null);
    setShowRewardModal(true);
  }

  function openEditModal(reward: Reward) {
    setEditingReward(reward);
    setShowRewardModal(true);
  }

  async function handleSaveReward(reward: Reward) {
    const payload = {
      title: reward.title,
      cost: reward.cost,
      icon: reward.icon,
    };

    try {
      if (editingReward) {
        const saved = await updateReward(editingReward.id, payload);
        setRewards((catalog) =>
          catalog.map((item) =>
            item.id === saved.id
              ? { ...saved, icon: saved.icon || "🎁" }
              : item,
          ),
        );
      } else {
        const saved = await createReward(payload);
        setRewards((catalog) => [
          ...catalog,
          { ...saved, icon: saved.icon || "🎁" },
        ]);
      }
      setShowRewardModal(false);
      setEditingReward(null);
    } catch (saveError) {
      throw new Error(errorMessage(saveError, "Could not save this reward."), {
        cause: saveError,
      });
    }
  }

  async function handleDeleteReward() {
    if (!deletingReward) return;
    try {
      setDeleting(true);
      setError("");
      await deleteReward(deletingReward.id);
      setRewards((catalog) =>
        catalog.filter((reward) => reward.id !== deletingReward.id),
      );
      setDeletingReward(null);
    } catch (deleteError) {
      setError(errorMessage(deleteError, "Could not delete this reward."));
    } finally {
      setDeleting(false);
    }
  }

  async function resolveRequest(
    request: ApiRewardRequest,
    action: "approve" | "reject",
  ) {
    try {
      setRequestActionId(request.id);
      setError("");
      const updated =
        action === "approve"
          ? await approveRewardRequest(request.id)
          : await rejectRewardRequest(request.id);
      setPending((requests) =>
        requests.filter((item) => item.id !== request.id),
      );
      setHistory((requests) => [updated, ...requests]);
    } catch (requestError) {
      setError(
        errorMessage(
          requestError,
          `Could not ${action} this reward request.`,
        ),
      );
    } finally {
      setRequestActionId(null);
    }
  }

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Rewards</h1>
          <p className="text-sm text-gray-400">
            Manage the reward catalog and approve requests
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Create Reward
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading rewards...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">Reward Catalog</h2>
              <span className="text-xs text-gray-400">
                {rewards.length} {rewards.length === 1 ? "reward" : "rewards"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {rewards.map((reward) => (
                <motion.article
                  key={reward.id}
                  whileHover={{ scale: 1.02 }}
                  className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <div className="mb-3 text-3xl">{reward.icon}</div>
                  <h3 className="mb-2 text-sm font-semibold leading-snug text-gray-900">
                    {reward.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600">
                      ⭐ {reward.cost}
                    </span>
                    <div className="flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => openEditModal(reward)}
                        aria-label={`Edit ${reward.title}`}
                        className="rounded-lg p-1.5 hover:bg-white"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingReward(reward)}
                        aria-label={`Delete ${reward.title}`}
                        className="rounded-lg p-1.5 hover:bg-white"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}

              <button
                type="button"
                onClick={openCreateModal}
                className="flex min-h-30 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 text-gray-400 transition-all hover:border-indigo-300 hover:bg-indigo-50/20 hover:text-indigo-600"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs font-semibold">
                  {rewards.length ? "Add Reward" : "Create your first reward"}
                </span>
              </button>
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pending Approval</h2>
                {pending.length > 0 && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                    {pending.length}
                  </span>
                )}
              </div>

              {pending.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-2 h-10 w-10 text-emerald-400" />
                  <p className="text-sm font-medium text-gray-500">All caught up!</p>
                  <p className="mt-1 text-xs text-gray-400">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((request) => {
                    const busy = requestActionId === request.id;
                    return (
                      <article
                        key={request.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xl">{request.childEmoji || "🧒"}</span>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">
                              {request.childName || "Child"}
                            </h3>
                            <p className="text-[10px] text-gray-400">
                              {formatRequestDate(request.requestedAt)}
                            </p>
                          </div>
                        </div>
                        <p className="mb-1 text-sm font-semibold text-gray-700">
                          {request.reward || "Reward"}
                        </p>
                        <p className="mb-3 text-xs font-bold text-amber-600">
                          ⭐ {request.cost ?? 0} coins
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void resolveRequest(request, "approve")}
                            className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                          >
                            {busy ? "Working..." : "✓ Approve"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void resolveRequest(request, "reject")}
                            className="flex-1 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
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

            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Recent History</h2>
              {history.length === 0 ? (
                <p className="py-5 text-center text-xs text-gray-400">
                  Approved and declined requests will appear here.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {history.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <span className="shrink-0 text-base">{item.childEmoji || "🧒"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug text-gray-700">
                          {item.childName || "Child"} · {item.reward || "Reward"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {item.status === "approved" ? "Approved" : "Declined"} ·{" "}
                          {formatRequestDate(item.resolvedAt ?? item.requestedAt)}
                        </p>
                      </div>
                      <div
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          item.status === "approved" ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {showRewardModal && (
        <RewardModal
          reward={editingReward ?? undefined}
          onClose={() => {
            setShowRewardModal(false);
            setEditingReward(null);
          }}
          onSave={handleSaveReward}
        />
      )}

      {deletingReward && (
        <DeleteRewardModal
          reward={deletingReward}
          loading={deleting}
          onClose={() => setDeletingReward(null)}
          onConfirm={() => void handleDeleteReward()}
        />
      )}
    </div>
  );
}
