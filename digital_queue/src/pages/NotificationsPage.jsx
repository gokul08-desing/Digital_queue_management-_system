import React from 'react';
import { Bell, CheckCheck, Inbox, ShieldCheck } from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import EmptyState from '../components/EmptyState';
import { useQueue } from '../context/QueueContext';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, unreadNotifCount } = useQueue();

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markNotificationRead(n.id);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            In-App Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time queue alerts, dynamic ETA recalculations, and peer swap notices.
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onRead={markNotificationRead}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No alerts right now"
          description="You are caught up. Important updates regarding your active token and arrival window will appear here."
        />
      )}
    </div>
  );
}
