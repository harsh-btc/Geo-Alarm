import API from './axios';

export const getAlarms = () => API.get('/alarms');
export const createAlarm = (data) => API.post('/alarms', data);
export const updateAlarm = (id, data) => API.put(`/alarms/${id}`, data);
export const deleteAlarm = (id) => API.delete(`/alarms/${id}`);
export const triggerAlarm = (id) => API.post(`/alarms/${id}/trigger`);
export const getAlarmHistory = () => API.get('/alarms/history');
