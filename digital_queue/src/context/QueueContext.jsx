import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getStoredJwt } from '../services/api';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [activeToken, setActiveToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [availableSwaps, setAvailableSwaps] = useState([]);
  const [isDemoAutoPlay, setIsDemoAutoPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    const jwt = getStoredJwt();
    if (!jwt) {
      setActiveToken(null);
      setNotifications([]);
      setAvailableSwaps([]);
      return;
    }
    try {
      // 1. Fetch active token from PostgreSQL
      try {
        const token = await api.getActiveToken();
        if (token) {
          setActiveToken(token);
        } else if (activeToken?.id) {
          // If we have an active queue id, poll queue status directly
          const polled = await api.getQueueStatus(activeToken.id);
          if (polled) setActiveToken(polled);
        }
      } catch (e) {
        // Only log if not a standard 404
        if (e.status !== 404 && e.status !== 401) {
          console.warn('Queue status check:', e.message);
        }
      }

      // 2. Fetch live in-app notifications
      try {
        const notifs = await api.getNotifications();
        setNotifications(Array.isArray(notifs) ? notifs : []);
      } catch (e) {
        if (e.status !== 401) {
          console.warn('Notifications fetch:', e.message);
        }
      }

      // 3. Fetch live eligible swaps
      try {
        const swaps = await api.getAvailableSwaps();
        setAvailableSwaps(Array.isArray(swaps) ? swaps : []);
      } catch (e) {
        if (e.status !== 401) {
          console.warn('Swaps fetch:', e.message);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error refreshing queue data from backend:', err);
      setError(err.message);
    }
  }, [activeToken?.id]);

  useEffect(() => {
    refreshData();
  }, []);

  // Demo auto-play: triggers backend demo tick every 7s
  useEffect(() => {
    let timer;
    if (isDemoAutoPlay && activeToken?.status !== 'COMPLETED' && activeToken?.status !== 'NO_SHOW') {
      timer = setInterval(async () => {
        try {
          await api.triggerDemoTick(activeToken?.queueId || 'queue_opd_001');
          await refreshData();
        } catch (e) {
          console.warn('Demo tick auto-play failed:', e.message);
        }
      }, 7000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDemoAutoPlay, activeToken?.queueId, activeToken?.status, refreshData]);

  const advanceSimulationStep = async () => {
    try {
      await api.triggerDemoTick(activeToken?.queueId || 'queue_opd_001');
      await refreshData();
    } catch (e) {
      console.error('Failed to trigger demo tick on backend:', e);
    }
  };

  const resetSimulation = async () => {
    // Refresh live status from PostgreSQL
    await refreshData();
  };

  const joinQueue = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.joinQueue(payload);
      if (res && res.queue) {
        setActiveToken(res.queue);
      }
      await refreshData();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const releaseCurrentSlot = async () => {
    if (!activeToken) return;
    const tokenId = activeToken.tokenId || activeToken.id;
    try {
      await api.releaseSlot(tokenId);
      setActiveToken((prev) => (prev ? { ...prev, isSlotReleased: true, status: 'EXCHANGE_AVAILABLE' } : null));
      await refreshData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const acceptSwap = async (swapId) => {
    try {
      const res = await api.acceptSwap(swapId);
      await refreshData();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const confirmArrival = async () => {
    if (!activeToken) return;
    const tokenId = activeToken.tokenId || activeToken.id;
    try {
      await api.confirmArrival(tokenId);
      setActiveToken((prev) => (prev ? { ...prev, status: 'CONFIRMED' } : null));
      await refreshData();
    } catch (err) {
      console.error('Confirm arrival failed:', err);
    }
  };

  const markNoShow = () => {
    setActiveToken((prev) => (prev ? { ...prev, status: 'NO_SHOW' } : null));
  };

  const completeService = () => {
    setActiveToken((prev) => (prev ? { ...prev, status: 'COMPLETED' } : null));
  };

  const cancelToken = () => {
    setActiveToken(null);
  };

  const markNotificationRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <QueueContext.Provider
      value={{
        activeToken,
        notifications,
        unreadNotifCount,
        availableSwaps,
        loading,
        error,
        isDemoAutoPlay,
        setIsDemoAutoPlay,
        advanceSimulationStep,
        resetSimulation,
        joinQueue,
        releaseCurrentSlot,
        acceptSwap,
        confirmArrival,
        markNoShow,
        completeService,
        cancelToken,
        markNotificationRead,
        refreshData,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within QueueProvider');
  return context;
}
