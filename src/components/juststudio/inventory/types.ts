import type { StockHistoryEntry } from '@/lib/types';

export const CATEGORIES = ['costumes', 'footwear', 'equipment', 'flooring & props', 'sound & av', 'hygiene', 'merchandise', 'other'];
export const UNITS = ['pcs', 'pairs', 'sets', 'boxes', 'rolls', 'bottles', 'kg', 'liters'];

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export function getStockStatus(current: number, min: number): StockStatus {
  if (current <= 0) return 'out-of-stock';
  if (current <= min) return 'low-stock';
  return 'in-stock';
}

/** Returns 0-100, scaled so minStock*4 = 100% */
export function getStockProgress(current: number, min: number): number {
  if (current <= 0) return 0;
  const ceiling = Math.max(min * 4, current);
  return Math.min(100, Math.round((current / ceiling) * 100));
}

export function getProgressColor(pct: number): string {
  if (pct === 0) return 'bg-red-500';
  if (pct <= 25) return 'bg-orange-400';
  if (pct <= 55) return 'bg-amber-400';
  return 'bg-emerald-500';
}

export const STATUS_LABEL: Record<StockStatus, string> = {
  'in-stock': 'Healthy',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
};

export const STATUS_COLOR: Record<StockStatus, string> = {
  'in-stock': 'text-emerald-600',
  'low-stock': 'text-orange-500',
  'out-of-stock': 'text-red-500',
};

export const STATUS_BADGE: Record<StockStatus, string> = {
  'in-stock': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'low-stock': 'bg-orange-50 text-orange-600 border-orange-100',
  'out-of-stock': 'bg-red-50 text-red-500 border-red-100',
};

const CATEGORY_COLOR: Record<string, string> = {
  costumes: 'bg-purple-100 text-purple-700',
  footwear: 'bg-pink-100 text-pink-700',
  equipment: 'bg-slate-100 text-slate-700',
  'flooring & props': 'bg-amber-100 text-amber-700',
  'sound & av': 'bg-blue-100 text-blue-700',
  hygiene: 'bg-teal-100 text-teal-700',
  merchandise: 'bg-cyan-100 text-cyan-700',
  other: 'bg-gray-100 text-gray-600',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLOR[category.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
}

/**
 * How fast this item is being used, derived from its own movement history.
 * Only 'use' entries count. Returns null without enough history to say
 * anything honest — a single data point, or less than a day elapsed.
 */
export function getDailyUsage(history: StockHistoryEntry[]): number | null {
  const uses = history.filter((h) => h.type === 'use');
  if (uses.length < 2) return null;

  const times = uses.map((u) => new Date(u.createdAt).getTime()).sort((a, b) => a - b);
  const spanDays = (Date.now() - times[0]!) / 86_400_000;
  if (spanDays < 1) return null;

  const totalUsed = uses.reduce((sum, u) => sum + u.quantity, 0);
  const perDay = totalUsed / spanDays;
  return perDay > 0 ? perDay : null;
}

export function getDaysRemaining(currentStock: number, dailyUsage: number | null): number | null {
  if (!dailyUsage || dailyUsage <= 0) return null;
  if (currentStock <= 0) return 0;
  return Math.floor(currentStock / dailyUsage);
}

/** Requires an explicit parLevel — a fabricated target would produce a confidently wrong order quantity. */
export function getSuggestedOrderQty(currentStock: number, parLevel: number | null | undefined): number | null {
  if (!parLevel || parLevel <= 0) return null;
  const gap = parLevel - currentStock;
  return gap > 0 ? gap : null;
}

export function formatHistoryDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
