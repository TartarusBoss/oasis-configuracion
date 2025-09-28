import axios from "axios";

const API = "http://localhost:4000/api";

export const getHello = () => axios.get(`${API}/hello`);
export const getReservas = () => axios.get(`${API}/reservas`);
