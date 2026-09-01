'use client';

import { ChevronDown, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { p2 } from './types';

const SLOTS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 15, 30, 45]) {
    SLOTS.push(`${p2(h)}:${p2(m)}`);
  }
}

export function TimePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => selectedRef.current?.scrollIntoView({ block: 'center' }), 0);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all ${
          open ? 'border-accent-500 ring-1 ring-accent-500' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          {value}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="overflow-y-auto" style={{ maxHeight: 180 }}>
            {SLOTS.map((slot) => (
              <button
                key={slot}
                ref={slot === value ? selectedRef : undefined}
                type="button"
                onClick={() => {
                  onChange(slot);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left font-mono text-sm transition-colors ${
                  slot === value ? 'bg-accent-500 font-semibold text-white' : 'text-gray-700 hover:bg-accent-50 hover:text-accent-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
