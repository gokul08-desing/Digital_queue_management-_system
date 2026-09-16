import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Custom polling hook to monitor active queue status.
 * Requirement: Polls every 5 seconds without WebSockets, cleans up on unmount.
 * @param {string} queueId 
 * @param {number} pollIntervalMs default 5000ms
 */
export function useQueueStatus(queueId, pollIntervalMs = 5000) {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastPolledAt, setLastPolledAt] = useState(null);
  const pollTimerRef = useRef(null);

  const fetchStatus = useCallback(async (isInitial = false) => {
    if (!queueId) return;
    try {
      if (isInitial) setLoading(true);
      const data = await api.getQueueStatus(queueId);
      if (data) {
        setQueueData(data);
        setError(null);
      } else {
        setQueueData(null);
      }
      setLastPolledAt(new Date());
    } catch (err) {
      console.error(`Polling error for queue ${queueId}:`, err);
      setError(err.message || 'Unable to update queue status.');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [queueId]);

  useEffect(() => {
    if (!queueId) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchStatus(true);

    // Setup polling every 5000ms
    pollTimerRef.current = setInterval(() => {
      fetchStatus(false);
    }, pollIntervalMs);

    // Cleanup interval on unmount
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [queueId, pollIntervalMs, fetchStatus]);

  return {
    queueData,
    loading,
    error,
    lastPolledAt,
    refresh: () => fetchStatus(false)
  };
}
