import React, { useState } from "react";
import { register, login } from "../api";

export default function Register({ onRegister }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ nombre, correo, password });
      const res2 = await login({ correo, password });
      const token = res2.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = { id: payload.id, nombre: payload.nombre, correo: payload.correo, rol: payload.rol, token };
      onRegister(user);
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="form-inner">
      <h3 className="card-title">Crear cuenta</h3>
      <input className="input" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className="input" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input className="input" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
