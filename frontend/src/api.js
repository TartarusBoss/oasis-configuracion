import axios from "axios";

// Usa variable de entorno en build, o fallback a '/api' si la defines distinto
const API = import.meta.env.VITE_API_URL ?? "/api";

export const getHello = () => axios.get(`${API}/hello`);
export const getReservas = () => axios.get(`${API}/reservas`);
