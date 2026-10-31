'use client';

import React from 'react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './LoadingState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items matching your criteria in the CMS database.',
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]/80 backdrop-blur-md shadow-xl">
      <table className="w-full text-left text-xs font-sans text-gray-300">
        <thead className="bg-[#181818] font-mono text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 select-none">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="py-4 px-5">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors hover:bg-white/[0.03] ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={`${keyExtractor(item)}-${col.key}`} className="py-4 px-5 align-middle">
                  {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;