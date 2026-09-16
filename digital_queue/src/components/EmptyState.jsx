import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No active records',
  description = 'There are no items to display at this moment.',
  icon: Icon = Inbox,
  actionLabel,
  onAction
}) {
  return (
    <div className="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition cursor-pointer shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
