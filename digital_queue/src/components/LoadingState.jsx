import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading live queue data...', fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="w-8 h-8 text-sky-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <span className="text-xs text-slate-400 mt-1">Synchronizing with service desk...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
