import { useState } from "react";
import { CheckCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import {
  PENDING_REWARDS_INIT,
  REWARDS_CATALOG,
} from "../data/dashboardData";
import type { Reward } from "../types/dashboard";
import DeleteRewardModal from "../components/rewards/DeleteRewardModal";
import RewardModal from "../components/rewards/RewardModal";

const COUPONS = [
  "Free Ice Cream 🍦",
  "Stay up 30 min later 🌙",
  "Skip chores Saturday ✨",
  "Game time +1 hour 🎮",
];

const RECENT_HISTORY = [
  {
    avatar: "🦄",
    description: "Emma redeemed Movie Night",
    date: "2d ago",
    status: "approved",
  },
  {
    avatar: "🚀",
    description: "Lucas redeemed Screen Time",
    date: "3d ago",
    status: "approved",
  },
  {
    avatar: "🌈",
    description: "Sofia's request declined",
    date: "5d ago",
    status: "declined",
  },
] as const;

export default function RewardsPage() {
  const [pending, setPending] = useState(PENDING_REWARDS_INIT);
  const [rewards, setRewards] = useState(REWARDS_CATALOG);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  function resolveRequest(requestId: string) {
    setPending((requests) =>
      requests.filter((request) => request.id !== requestId),
    );
  }

  function openCreateModal() {
    setEditingReward(null);
    setShowRewardModal(true);
  }

  function openEditModal(reward: Reward) {
    setEditingReward(reward);
    setShowRewardModal(true);
  }

  function handleSaveReward(reward: Reward) {
    setRewards((catalog) => {
      const existing = catalog.some((item) => item.id === reward.id);
      return existing
        ? catalog.map((item) => (item.id === reward.id ? reward : item))
        : [...catalog, reward];
    });
    setShowRewardModal(false);
    setEditingReward(null);
  }

  function handleDeleteReward() {
    if (!deletingReward) return;
    setRewards((catalog) =>
      catalog.filter((reward) => reward.id !== deletingReward.id),
    );
    setDeletingReward(null);
  }

  return (
    <div className="space-y-5">
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
          className="flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Reward
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-semibold text-gray-900">Reward Catalog</h2>
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
                      className="rounded-lg p-1 hover:bg-white"
                    >
                      <Pencil className="h-3 w-3 text-gray-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingReward(reward)}
                      aria-label={`Delete ${reward.title}`}
                      className="rounded-lg p-1 hover:bg-white"
                    >
                      <Trash2 className="h-3 w-3 text-gray-500" />
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
              <span className="text-xs font-semibold">Add Reward</span>
            </button>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              🎟️ Coupons
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-amber-200 bg-amber-50 p-3"
                >
                  <span className="flex-1 text-xs font-semibold text-amber-800">
                    {coupon}
                  </span>
                  <button
                    type="button"
                    aria-label={`Edit ${coupon}`}
                    className="text-amber-500 hover:text-amber-700"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
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
                <p className="text-sm font-medium text-gray-500">
                  All caught up!
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  No pending requests
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((request) => (
                  <article
                    key={request.id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{request.childEmoji}</span>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {request.childName}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          {request.requestedAt}
                        </p>
                      </div>
                    </div>
                    <p className="mb-1 text-sm font-semibold text-gray-700">
                      {request.reward}
                    </p>
                    <p className="mb-3 text-xs font-bold text-amber-600">
                      ⭐ {request.cost} coins
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => resolveRequest(request.id)}
                        className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
                      >
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => resolveRequest(request.id)}
                        className="flex-1 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        ✗ Decline
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Recent History
            </h2>
            <div className="space-y-2.5">
              {RECENT_HISTORY.map((item) => (
                <div
                  key={item.description}
                  className="flex items-start gap-2.5"
                >
                  <span className="shrink-0 text-base">{item.avatar}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug text-gray-700">
                      {item.description}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {item.date}
                    </p>
                  </div>
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.status === "approved"
                        ? "bg-emerald-400"
                        : "bg-rose-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

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
          onClose={() => setDeletingReward(null)}
          onConfirm={handleDeleteReward}
        />
      )}
    </div>
  );
}
