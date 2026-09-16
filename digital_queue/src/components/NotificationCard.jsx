import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, ArrowLeftRight } from 'lucide-react';

export default function NotificationCard({ notification, onRead }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'WARNING':
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'SWAP':
        return <ArrowLeftRight className="w-4 h-4 text-sky-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div
      onClick={() => onRead && onRead(notification.id)}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        notification.isRead
          ? 'bg-white border-slate-200 text-slate-700'
          : 'bg-sky-50/40 border-sky-200 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {notification.title}
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
              )}
            </h4>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              {notification.timestamp}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
