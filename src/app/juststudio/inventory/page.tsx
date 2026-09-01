'use client';

import { AlertTriangle, Package, Plus, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { AddStockModal } from '@/components/juststudio/inventory/add-stock-modal';
import { EditStockModal } from '@/components/juststudio/inventory/edit-stock-modal';
import { StockDetailPanel } from '@/components/juststudio/inventory/stock-detail-panel';
import { StockRow } from '@/components/juststudio/inventory/stock-row';
import { StockStats } from '@/components/juststudio/inventory/stock-stats';
import { CATEGORIES, getStockStatus, type StockStatus } from '@/components/juststudio/inventory/types';
import { UpdateStockModal } from '@/components/juststudio/inventory/update-stock-modal';
import { stockApi } from '@/lib/api';
import { ApiError } from '@/lib/api-fetch';
import type { StockItem } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState<{ open: boolean; defaultType: 'replenish' | 'use' }>({ open: false, defaultType: 'replenish' });
  const [editTarget, setEditTarget] = useState<StockItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null);

  const load = () => stockApi.list().then(setItems).catch(() => toast.error('Failed to load inventory'));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    load().finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    load().finally(() => setIsRefreshing(false));
  };

  const filtered = useMemo(() => {
    let result = [...items];
    if (selectedStatus !== 'all') result = result.filter((p) => getStockStatus(p.currentStock, p.minStock) === selectedStatus);
    if (selectedCategory !== 'all') result = result.filter((p) => p.category === selectedCategory);
    if (searchTerm) result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return result;
  }, [items, selectedStatus, selectedCategory, searchTerm]);

  useEffect(() => {
    // Reset to page 1 whenever the active filters change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [selectedStatus, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAdd = (created: StockItem) => {
    setItems((prev) => [created, ...prev]);
    setIsAddOpen(false);
  };

  const handleUpdate = (updated: StockItem) => {
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedItem?.id === updated.id) setSelectedItem(updated);
    setUpdateModal({ open: false, defaultType: 'replenish' });
  };

  const handleDetailsUpdate = (updated: StockItem) => {
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedItem?.id === updated.id) setSelectedItem(updated);
    setEditTarget(null);
  };

  const handleDelete = async (item: StockItem) => {
    try {
      await stockApi.remove(item.id);
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      if (selectedItem?.id === item.id) setSelectedItem(null);
      setDeleteTarget(null);
      toast.success('Product removed');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove product');
    }
  };

  const openAddStock = (item: StockItem) => {
    setSelectedItem(item);
    setUpdateModal({ open: true, defaultType: 'replenish' });
  };
  const openUseStock = (item: StockItem) => {
    setSelectedItem(item);
    setUpdateModal({ open: true, defaultType: 'use' });
  };

  const hasFilters = !!searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="min-h-full bg-gray-50">
      <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
          <div className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />
          <button onClick={handleRefresh} className="hidden items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 sm:flex">
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-56 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-transparent bg-gray-100 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-accent-100"
            />
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent-200/50 transition-colors hover:bg-accent-600"
          >
            <Plus size={16} />
            Add product
          </button>
        </div>
      </div>

      <div className="space-y-6 p-4 md:p-6">
        <StockStats items={items} />

        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-gray-100 bg-gray-50/50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm font-medium text-gray-600">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors focus:border-accent-500 focus:outline-none"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as StockStatus | 'all')}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:border-accent-500 focus:outline-none ${
                  selectedStatus !== 'all' ? 'border-accent-200 bg-accent-50 text-accent-700' : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <option value="all">All statuses</option>
                <option value="in-stock">In stock</option>
                <option value="low-stock">Low stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                  }}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">{filtered.length} items</div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-12 gap-4 border-b border-gray-100 bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-4">Stock level</div>
              <div className="col-span-1" />
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-t-2 border-accent-500" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">No products found</p>
                <p className="mt-1 text-xs text-gray-400">{hasFilters ? 'Try adjusting your filters.' : 'Add your first product to get started.'}</p>
              </div>
            ) : (
              <div className="min-w-[560px]">
                {paginated.map((item) => (
                  <StockRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={(i) => setSelectedItem((prev) => (prev?.id === i.id ? null : i))}
                    onEdit={(i) => setEditTarget(i)}
                    onDelete={(i) => setDeleteTarget(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between rounded-b-2xl border-t border-gray-100 bg-gray-50/30 p-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'bg-accent-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <StockDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} onAddStock={openAddStock} onUseStock={openUseStock} onEdit={(i) => setEditTarget(i)} onDelete={(i) => setDeleteTarget(i)} />

      {isAddOpen && <AddStockModal onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />}

      {updateModal.open && selectedItem && (
        <UpdateStockModal product={selectedItem} defaultType={updateModal.defaultType} onClose={() => setUpdateModal({ open: false, defaultType: 'replenish' })} onUpdate={handleUpdate} />
      )}

      {editTarget && <EditStockModal product={editTarget} onClose={() => setEditTarget(null)} onUpdate={handleDetailsUpdate} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Remove product?</h3>
              <p className="mb-6 text-sm text-gray-500">
                Remove <span className="font-medium text-gray-900">{deleteTarget.name}</span> from your inventory. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => void handleDelete(deleteTarget)} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
