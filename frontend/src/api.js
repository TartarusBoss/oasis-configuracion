import axios from "axios";

// En desarrollo usar backend en localhost si no se provee VITE_API_URL
const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const client = axios.create({ baseURL: API });

// Usuarios
export const register = (payload) => client.post(`/usuarios/register`, payload);
export const login = (payload) => client.post(`/usuarios/login`, payload);
export const getUsuarios = () => client.get(`/usuarios`);

// Reservas
export const getReservas = (params, token) => token ? 
  client.get(`/reservas`, { params, headers: { Authorization: `Bearer ${token}` } }) : 
  client.get(`/reservas`, { params });
export const getEscenarios = () => client.get(`/escenarios`);
export const createReserva = (payload, token) => client.post(`/reservas`, payload, { headers: { Authorization: `Bearer ${token}` } });
export const updateReserva = (id, payload, token) => client.put(`/reservas/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
export const deleteReserva = (id, token) => client.delete(`/reservas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getReservasByUsuario = (usuarioId, token) => client.get(`/reservas/usuario/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } });

// Hello (si existe)
export const getHello = () => client.get(`/`);

export default client;
