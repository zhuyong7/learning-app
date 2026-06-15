/**
 * Rewards API endpoints.
 */
import { request } from "./client";

export interface MarketReward {
  id: number;
  name: string;
  cost: number;
  builtIn: boolean;
}

export interface Redemption {
  id: number;
  userName: string;
  rewardName: string;
  cost: number;
  redeemedAt: string;
}

export interface RewardSummary {
  userName: string;
  balance: number;
  market: MarketReward[];
  redemptions: Redemption[];
}

export interface RewardCreate {
  name: string;
  cost: number;
}

/** Fetch reward summary for a user. */
export async function fetchRewards(userName: string): Promise<RewardSummary> {
  return request<RewardSummary>(`/api/rewards/${userName}`);
}

/** Add a custom reward to the market (admin only). */
export async function addMarketReward(reward: RewardCreate): Promise<RewardSummary> {
  return request<RewardSummary>("/api/rewards/market", {
    method: "POST",
    body: JSON.stringify(reward),
  });
}

/** Delete a custom reward (admin only). */
export async function deleteMarketReward(rewardId: number): Promise<RewardSummary> {
  return request<RewardSummary>(`/api/rewards/market/${rewardId}`, {
    method: "DELETE",
  });
}

/** Redeem a reward (children only). */
export async function redeemReward(rewardId: number): Promise<RewardSummary> {
  return request<RewardSummary>("/api/rewards/redeem", {
    method: "POST",
    body: JSON.stringify({ rewardId }),
  });
}
