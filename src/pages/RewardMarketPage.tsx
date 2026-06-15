/**
 * RewardMarketPage — coin market where children redeem rewards.
 * Admin can add/delete custom rewards; children can redeem.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import CoinStepper from "../components/reward/CoinStepper";
import { useRewards } from "../hooks/useRewards";

interface RewardMarketPageProps {
  isAdmin: boolean;
  userName: string;
}

export default function RewardMarketPage({ isAdmin, userName }: RewardMarketPageProps) {
  const {
    summary,
    saving,
    balance,
    market,
    redemptions,
    redeem,
    addReward,
    deleteReward,
    refresh,
  } = useRewards(isAdmin ? "child" : userName);

  const [customName, setCustomName] = useState("");
  const [customCost, setCustomCost] = useState(1);

  const handleRedeem = async (rewardId: number) => {
    try {
      await redeem(rewardId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "兑换失败");
    }
  };

  const handleAddReward = async () => {
    const name = customName.trim();
    if (!name) {
      alert("请输入奖励名称");
      return;
    }
    try {
      await addReward(name, customCost);
      setCustomName("");
      setCustomCost(1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "添加失败");
    }
  };

  const handleDeleteReward = async (rewardId: number) => {
    if (!window.confirm("确定删除这个奖励吗？")) return;
    try {
      await deleteReward(rewardId);
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  };

  return (
    <div className="page">
      {/* Sky decorations */}
      <div className="sky-decor sky-decor-cloud cloud-one">☁️</div>
      <div className="sky-decor sky-decor-cloud cloud-two">☁️</div>
      <div className="sky-decor rainbow">🌈</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-shell"
        style={{ maxWidth: 1100 }}
      >
        {/* Main Column */}
        <div className="main-column">
          {/* Market Card */}
          <div className="market-card">
            <div className="market-heading">
              <span className="title-badge">🪙 金币市场</span>
              <div className="market-balance-pill">
                🪙 金币：<strong>{balance}</strong>
              </div>
            </div>

            {/* Admin: Add reward form */}
            {isAdmin && (
              <div className="market-admin-form">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="自定义奖励名称"
                  className="cartoon-input"
                />
                <CoinStepper value={customCost} onChange={setCustomCost} hint="花费金币" />
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddReward}
                  disabled={saving}
                  className="copy-button"
                >
                  新增奖励
                </motion.button>
              </div>
            )}

            {/* Reward items grid */}
            <div className="market-list">
              {market.map((reward) => (
                <div key={reward.id} className="market-item">
                  <div className="market-ticket-main">
                    <strong>{reward.name}</strong>
                    <span className="market-cost">🪙 {reward.cost}</span>
                  </div>
                  {isAdmin && !reward.builtIn ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteReward(reward.id)}
                      className="text-xs font-extrabold border-0 text-white cursor-pointer rounded-full px-3 py-1"
                      style={{ background: "linear-gradient(135deg, #fb7185, #f43f5e)", boxShadow: "0 4px 0 #be123c" }}
                    >
                      删除
                    </motion.button>
                  ) : !isAdmin ? (
                    <motion.button
                      whileHover={balance >= reward.cost ? { y: -2 } : {}}
                      whileTap={balance >= reward.cost ? { scale: 0.95 } : {}}
                      onClick={() => handleRedeem(reward.id)}
                      disabled={balance < reward.cost}
                      className="text-xs font-extrabold border-0 text-white cursor-pointer rounded-full px-3 py-1"
                      style={{
                        background: balance >= reward.cost
                          ? "linear-gradient(135deg, #22c55e, #16a34a)"
                          : "#e5e7eb",
                        boxShadow: balance >= reward.cost ? "0 4px 0 #15803d" : "none",
                        color: balance >= reward.cost ? "#fff" : "#9ca3af",
                      }}
                    >
                      兑换
                    </motion.button>
                  ) : (
                    <span className="market-built-in">内置</span>
                  )}
                </div>
              ))}
            </div>

            {/* Redemption history (child only) */}
            {!isAdmin && redemptions.length > 0 && (
              <div className="redemption-list">
                <strong>最近兑换</strong>
                {redemptions.slice(0, 5).map((r) => (
                  <p key={r.id}>
                    {r.rewardName} — {r.cost} 金币
                    <span className="text-xs text-slate-400 ml-2">
                      {new Date(r.redeemedAt).toLocaleDateString()}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
