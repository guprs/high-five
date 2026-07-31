import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { KidTheme } from "../../data/themes";
import {
  cancelRewardRequest,
  createRewardRequest,
  getRewardRequests,
  getRewards,
  type ApiReward,
  type ApiRewardRequest,
} from "../../services/rewards";
import type { Child } from "../../types/dashboard";

interface Props {
  child: Child;
  theme: KidTheme;
}

export default function KidShopTab({ child, theme }: Props) {
  const [items, setItems] = useState<ApiReward[]>([]);
  const [requests, setRequests] = useState<ApiRewardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionRewardId, setActionRewardId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShop() {
      try {
        const [catalog, pendingRequests] = await Promise.all([
          getRewards(),
          getRewardRequests("pending"),
        ]);
        setItems(catalog);
        setRequests(
          pendingRequests.filter((request) => request.childId === child.id),
        );
      } catch {
        setError("The reward shop could not be loaded. Please ask a parent for help.");
      } finally {
        setLoading(false);
      }
    }

    void Promise.resolve().then(loadShop);
  }, [child.id]);

  async function requestReward(reward: ApiReward) {
    try {
      setActionRewardId(reward.id);
      setError("");
      const request = await createRewardRequest({
        childId: child.id,
        rewardId: reward.id,
      });
      setRequests((current) => [request, ...current]);
    } catch {
      setError("Your request could not be sent. Please try again.");
    } finally {
      setActionRewardId(null);
    }
  }

  async function withdrawRequest(request: ApiRewardRequest) {
    try {
      setActionRewardId(request.rewardId);
      setError("");
      await cancelRewardRequest(request.id);
      setRequests((current) =>
        current.filter((item) => item.id !== request.id),
      );
    } catch {
      setError("Your request could not be withdrawn. Please try again.");
    } finally {
      setActionRewardId(null);
    }
  }

  return (
    <div className="space-y-5 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between rounded-3xl border border-white/20 bg-white/15 p-5 shadow-xl backdrop-blur-md"
      >
        <div>
          <p className="text-sm font-bold text-white/70 uppercase">Your Coins</p>
          <h2
            className="text-4xl font-black text-yellow-300"
            style={{ fontFamily: theme.font }}
          >
            ⭐ {child.coins}
          </h2>
        </div>
        <div className="text-6xl">🛍️</div>
      </motion.div>

      {error && (
        <p className="rounded-2xl border border-white/20 bg-rose-500/80 px-4 py-3 text-sm font-bold text-white">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-3xl border border-white/20 bg-white/15 p-8 text-center font-bold text-white/80 backdrop-blur-md">
          Loading rewards...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-white/20 bg-white/15 p-8 text-center backdrop-blur-md">
          <div className="text-5xl">🎁</div>
          <h3 className="mt-3 text-lg font-black text-white">The shop is empty</h3>
          <p className="mt-1 text-sm font-semibold text-white/70">
            Ask a parent to add some family rewards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-1 py-2 min-[420px]:grid-cols-2">
          {items.map((item) => {
            const pendingRequest = requests.find(
              (request) => request.rewardId === item.id,
            );
            const canRequest = child.coins >= item.cost;
            const busy = actionRewardId === item.id;

            return (
              <motion.article
                key={item.id}
                layout
                whileHover={{ scale: canRequest && !pendingRequest ? 1.02 : 1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-3xl border border-white/20 p-5 text-center shadow-lg"
                style={{
                  background: pendingRequest
                    ? "rgba(34,197,94,.75)"
                    : `linear-gradient(135deg, ${theme.cardFrom}, ${theme.cardTo})`,
                }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="mb-2 text-5xl"
                >
                  {item.icon || "🎁"}
                </motion.div>
                <h3
                  className="text-sm font-black text-white"
                  style={{ fontFamily: theme.font }}
                >
                  {item.title}
                </h3>
                <div className="mt-2 font-bold text-yellow-300">⭐ {item.cost}</div>

                {pendingRequest ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void withdrawRequest(pendingRequest)}
                    className="mt-3 w-full rounded-xl bg-white/30 py-2 text-xs font-black text-white transition hover:bg-white/40 disabled:opacity-60"
                  >
                    {busy ? "Withdrawing..." : "✓ Requested · Withdraw"}
                  </button>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    disabled={!canRequest || busy}
                    onClick={() => void requestReward(item)}
                    className={`mt-3 w-full rounded-xl py-2 text-xs font-black transition ${
                      canRequest
                        ? "bg-white text-purple-700 shadow-lg"
                        : "bg-white/20 text-white/50"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {busy
                      ? "Sending..."
                      : canRequest
                        ? "Ask for it 🎁"
                        : `Need ${item.cost - child.coins}`}
                  </motion.button>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
