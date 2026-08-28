import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export async function getPostings(params = {}) {
  const { data } = await api.get('/postings', { params });
  return data; // { total, page, limit, results }
}

export async function getTimeline(interval = 'day') {
  const { data } = await api.get('/stats/timeline', { params: { interval } });
  return data; // [{ period, count }]
}

export async function getTopGroups(limit = 10) {
  const { data } = await api.get('/stats/top-groups', { params: { limit } });
  return data; // [{ group, count }]
}
export async function getKnownEvents() {
  const { data } = await api.get('/stats/events');
  return data;
} 

export default api;
