'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export function CreateRoleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, description: string) => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), desc.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Create a role</h3>
          <button onClick={onClose} className="text-gray-500 transition-colors hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Role name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="e.g. instructor"
              autoFocus
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="What this role is for"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-500 outline-none transition-all focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Create role
          </button>
        </div>
      </div>
    </div>
  );
}
