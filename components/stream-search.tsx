'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StreamSearchProps {
  streams: any[];
  onFilter: (filtered: any[]) => void;
  placeholder?: string;
}

export function StreamSearch({ streams, onFilter, placeholder = 'Search streams...' }: StreamSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'cancelled'>('all');

  const filtered = useMemo(() => {
    let result = streams;

    // Filter by status
    if (filterType === 'active') {
      result = result.filter((s) => s.isActive);
    } else if (filterType === 'cancelled') {
      result = result.filter((s) => !s.isActive);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.id?.toString().includes(term) ||
          s.employee?.toLowerCase().includes(term) ||
          s.employer?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [streams, searchTerm, filterType]);

  return (
    <div className="space-y-3 mb-6 animate-in fade-in">
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pl-10 bg-[#1a1a1a] border-[#1a1a1a]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1">
          {(['all', 'active', 'cancelled'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                filterType === type
                  ? 'bg-[#FFD600] text-black'
                  : 'bg-[#1a1a1a] text-[#cccccc] hover:bg-[#2a2a2a]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#999999]">
        {filtered.length} of {streams.length} streams
      </p>
    </div>
  );
}
