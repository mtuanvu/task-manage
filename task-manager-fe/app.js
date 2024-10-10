import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

// Các API cho công việc
export const fetchTasks = () => API.get('/tasks/');
export const createTask = (newTask) => API.post('/tasks/', newTask);
export const updateTask = (id, updatedTask) => API.patch(`/tasks/${id}/`, updatedTask);
export const deleteTask = (id) => API.delete(`/tasks/${id}/`);

// API cho đăng ký và đăng nhập
export const login = (credentials) => API.post('/auth/jwt/create/', credentials);
