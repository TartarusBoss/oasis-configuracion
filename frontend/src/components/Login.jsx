import React, { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ correo, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = { id: payload.id, nombre: payload.nombre, correo: payload.correo, rol: payload.rol, token };
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-inner">
      <h3 className="card-title">Iniciar sesión</h3>
      <input className="input" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input className="input" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
