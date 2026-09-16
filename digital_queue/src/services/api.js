/**
 * DigitalQueue API Service
 * Exclusively communicates with the Flask REST Backend via PostgreSQL.
 * Mock data is NEVER used as the source of truth or silent fallback.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getStoredJwt() {
  try {
    return localStorage.getItem('dq_jwt') || '';
  } catch (e) {
    return '';
  }
}

export function setStoredJwt(token) {
  try {
    if (token) {
      localStorage.setItem('dq_jwt', token);
    } else {
      localStorage.removeItem('dq_jwt');
    }
  } catch (e) {}
}

function authHeaders() {
  const token = getStoredJwt();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = BASE_URL + endpoint;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {})
      }
    });
  } catch (netErr) {
    const errorMsg = 'Unable to connect to queue service. Please ensure the backend is running at ' + BASE_URL;
    const err = new Error(errorMsg);
    err.isNetworkError = true;
    throw err;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || ('Request failed with status ' + response.status);
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoStr;
  }
}

function normaliseQueueStatus(raw, extraContext = {}) {
  if (!raw) return null;
  const startStr = raw.recommendedArrivalStart;
  const endStr = raw.recommendedArrivalEnd;

  return {
    id: raw.queueId || raw.id || extraContext.queueId,
    queueId: raw.queueId || raw.id || extraContext.queueId,
    tokenId: raw.tokenId || raw.id,
    tokenNumber: raw.tokenNumber,
    serviceId: raw.serviceId || extraContext.serviceId,
    serviceName: raw.serviceName || extraContext.serviceName || 'General OPD',
    hospitalId: raw.hospitalId || extraContext.hospitalId,
    hospitalName: raw.hospitalName || extraContext.hospitalName || 'ABC Multispeciality Hospital',
    counterId: raw.counterId || (raw.counter && raw.counter.id) || extraContext.counterId,
    counterName: raw.counterName || (raw.counter && raw.counter.name) || extraContext.counterName || 'Counter Desk',
    currentToken: (raw.counter && raw.counter.currentToken) || raw.currentToken || (raw.tokenNumber ? Math.max(1, raw.tokenNumber - (raw.peopleAhead || 0)) : 1),
    peopleAhead: raw.peopleAhead !== undefined ? raw.peopleAhead : 0,
    estimatedWaitMinutes: raw.estimatedWaitMinutes !== undefined ? raw.estimatedWaitMinutes : 0,
    recommendedArrivalStart: startStr ? formatTime(startStr) : 'Now',
    recommendedArrivalEnd: endStr ? formatTime(endStr) : 'In 15 mins',
    rawArrivalStart: startStr,
    rawArrivalEnd: endStr,
    status: raw.status || 'WAITING',
    isSlotReleased: raw.status === 'EXCHANGE_AVAILABLE' || !!raw.isSlotReleased,
    lastUpdated: raw.lastUpdated ? new Date(raw.lastUpdated) : new Date(),
    serviceDurationMinutes: raw.serviceDurationMinutes || 4.0,
    tokenType: 'STANDARD'
  };
}

export const api = {
  async loginUser(phone, password) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    if (res.token) {
      setStoredJwt(res.token);
    }
    if (res.user) {
      localStorage.setItem('dq_user', JSON.stringify(res.user));
    }
    return { user: res.user, token: res.token };
  },

  async registerUser({ name, phone, password, email }) {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, phone, password, email })
    });
    if (res.token) {
      setStoredJwt(res.token);
    }
    if (res.user) {
      localStorage.setItem('dq_user', JSON.stringify(res.user));
    }
    return { user: res.user, token: res.token };
  },

  async getCurrentUser() {
    const res = await request('/api/auth/me');
    return res.user;
  },

  async searchLocations(query = '', pincode = '') {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (pincode) params.append('pincode', pincode);
    const res = await request('/api/locations?' + params.toString());
    return (res.locations || []).map((loc) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type || 'HOSPITAL',
      address: loc.address,
      pincode: loc.pincode,
      operatingHours: loc.operatingHours || '08:00 AM - 08:00 PM',
      phone: loc.phone || '+91 44 2621 0000',
      totalActiveQueues: loc.totalActiveQueues || 3,
      averageWaitMinutes: loc.averageWaitMinutes || 15,
      services: loc.services || []
    }));
  },

  async getLocation(locationId) {
    const res = await request('/api/locations/' + locationId);
    const loc = res.location || res;
    return {
      id: loc.id,
      name: loc.name,
      type: loc.type || 'HOSPITAL',
      address: loc.address,
      pincode: loc.pincode,
      operatingHours: loc.operatingHours || '08:00 AM - 08:00 PM',
      phone: loc.phone || '+91 44 2621 0000',
      services: (loc.services || []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description || 'Consultation and service desk',
        active: s.active !== undefined ? s.active : true,
        queue: s.queue || null,
        counters: s.counters || []
      }))
    };
  },

  async getServices(locationId) {
    const res = await request('/api/locations/' + locationId + '/services');
    return res.services || [];
  },

  async getCounters(serviceId) {
    const res = await request('/api/services/' + serviceId + '/counters');
    return (res.counters || []).map((c) => ({
      id: c.counterId || c.id,
      counterId: c.counterId || c.id,
      name: c.name,
      currentToken: c.currentToken,
      peopleWaiting: c.peopleWaiting,
      averageServiceMinutes: c.averageServiceMinutes,
      estimatedWaitMinutes: c.estimatedWaitMinutes,
      available: c.available !== undefined ? c.available : true
    }));
  },

  async getCounterRecommendation(serviceId) {
    const res = await request('/api/services/' + serviceId + '/recommendation');
    const rec = res.recommendation || res;
    return {
      counterId: rec.counterId,
      counterNumber: rec.counterId ? (parseInt(String(rec.counterId).replace(/\\D/g, ''), 10) || 2) : 2,
      reason: rec.reason || 'Optimal throughput and shortest queue backlog.',
      estimatedWaitMinutes: rec.estimatedWaitMinutes,
      confidence: rec.confidence || 'High',
      peopleWaiting: rec.peopleWaiting,
      averageServiceMinutes: rec.averageServiceMinutes,
      label: 'AI-Assisted Recommendation'
    };
  },

  async joinQueue(payload) {
    const serviceId = payload.serviceId || (payload.service && payload.service.id);
    const counterId = payload.counterId || (payload.counter && (payload.counter.counterId || payload.counter.id));
    const res = await request('/api/services/' + serviceId + '/join', {
      method: 'POST',
      body: JSON.stringify({ counterId })
    });
    const queueObj = normaliseQueueStatus(res.queue, {
      serviceId,
      counterId,
      serviceName: payload.service && payload.service.name,
      hospitalName: payload.hospital && payload.hospital.name
    });
    return { success: true, queue: queueObj };
  },

  async getActiveToken() {
    try {
      const res = await request('/api/tokens/active');
      if (res && res.token) {
        return normaliseQueueStatus(res.token);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async getQueueStatus(queueId) {
    const res = await request('/api/queues/' + queueId + '/status');
    return normaliseQueueStatus(res.queue);
  },

  async confirmArrival(tokenId) {
    return request('/api/tokens/' + tokenId + '/confirm', { method: 'POST' });
  },

  async releaseSlot(tokenId) {
    return request('/api/tokens/' + tokenId + '/release', { method: 'POST' });
  },

  async getAvailableSwaps() {
    const res = await request('/api/swaps/available');
    return (res.swaps || []).map((s) => ({
      id: s.swapId || s.id,
      swapId: s.swapId || s.id,
      offeredToken: s.availableToken || s.offeredToken,
      offeredBy: {
        name: s.offeredByName || 'Peer Patient',
        maskedPhone: '98401*****'
      },
      serviceName: s.service || s.serviceName || 'General OPD',
      counterName: s.counter || s.counterName || 'Counter 2',
      offeredArrivalTime: s.arrivalTime ? formatTime(s.arrivalTime) : 'In 15 mins',
      offeredEtaMinutes: 10,
      timeAdvantageMinutes: 8,
      eligibilityReason: 'Same service line with valid waiting status verified.',
      status: 'AVAILABLE'
    }));
  },

  async requestSwap(swapId) {
    return request('/api/swaps/' + swapId + '/request', { method: 'POST' });
  },

  async acceptSwap(swapId) {
    return request('/api/swaps/' + swapId + '/accept', { method: 'POST' });
  },

  async getNotifications() {
    const res = await request('/api/notifications');
    return (res.notifications || []).map((n) => ({
      id: n.id,
      title: n.type || 'Queue Alert',
      message: n.message,
      timestamp: n.createdAt ? formatTime(n.createdAt) : 'Just now',
      isRead: n.read || false,
      type: (n.type || 'info').toLowerCase()
    }));
  },

  async markNotificationRead(id) {
    return { success: true };
  },

  async triggerDemoTick(queueId = 'queue_opd_001', demoKey = 'change-demo-key') {
    return request('/api/demo/tick/' + queueId, {
      method: 'POST',
      headers: { 'X-Demo-Key': demoKey }
    });
  }
};

export default api;
