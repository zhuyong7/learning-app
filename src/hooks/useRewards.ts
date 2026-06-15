/**
 * Rewards hook.
 * Manages coin balance, market, and redemption.
 */
import { useState, useCallback, useEffect } from "react";
import {
  fetchRewards,
  addMarketReward,
  deleteMarketReward,
  redeemReward,
  type RewardSummary,
} from "../api/rewards";

const CHILD_ACCOUNT = "child";

export function useRewards(userName: string | null) {
  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRewards = useCallback(async () => {
    if (!userName) return;
    setLoading(true);
    try {
      const data = await fetchRewards(userName === "admin" ? CHILD_ACCOUNT : userName);
      setSummary(data);
    } catch (e) {
      console.error("Failed to load rewards:", e);
    } finally {
      setLoading(false);
    }
  }, [userName]);

  const redeem = useCallback(async (rewardId: number): Promise<RewardSummary> => {
    setSaving(true);
    try {
      const data = await redeemReward(rewardId);
      setSummary(data);
      return data;
    } catch (e) {
      console.error("Failed to redeem:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const addReward = useCallback(async (name: string, cost: number): Promise<RewardSummary> => {
    setSaving(true);
    try {
      const data = await addMarketReward({ name, cost });
      setSummary(data);
      return data;
    } catch (e) {
      console.error("Failed to add reward:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteReward = useCallback(async (rewardId: number): Promise<RewardSummary> => {
    setSaving(true);
    try {
      const data = await deleteMarketReward(rewardId);
      setSummary(data);
      return data;
    } catch (e) {
      console.error("Failed to delete reward:", e);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  return {
    summary,
    loading,
    saving,
    balance: summary?.balance ?? 0,
    market: summary?.market ?? [],
    redemptions: summary?.redemptions ?? [],
    redeem,
    addReward,
    deleteReward,
    refresh: loadRewards,
  };
}
