import React, { useEffect, useState } from "react";
import { getReservasByUsuario, deleteReserva, updateReserva, getReservas } from "../api";
import ReservaForm from "./ReservaForm";

export default function Profile({ user }) {
  const [historial, setHistorial] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchHistorial() {
    try {
      const res = await getReservasByUsuario(user.id, user.token);
      setHistorial(res.data);
    } catch (err) {
      setError("No se pudo cargar historial");
    }
  }

  useEffect(() => { fetchHistorial(); }, []);

  const handleCancel = async (id) => {
    setError(null);
    try {
      await deleteReserva(id, user.token);
      await fetchHistorial();
    } catch (err) {
      setError(err.response?.data?.error || "Error al cancelar");
    }
  };

  const handleEdit = (reserva) => setEditing(reserva);
  const handleUpdate = async (payload) => {
    try {
      await updateReserva(editing.id, payload, user.token);
      setEditing(null);
      await fetchHistorial();
    } catch (err) {
      setError(err.response?.data?.error || "Error al editar");
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Mi perfil</h3>
      <h4>Historial de reservas</h4>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {historial.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            <strong>{r.Escenario?.nombre}</strong> — {r.fecha} — {r.hora_inicio}
            <div style={{ marginTop: 4 }}>
              <button onClick={() => handleEdit(r)} style={{ marginRight: 6 }}>Editar</button>
              <button onClick={() => handleCancel(r.id)}>Cancelar</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div style={{ marginTop: 12 }}>
          <h4>Editar reserva #{editing.id}</h4>
          <ReservaForm escenarios={[] /* not strictly needed here */} initial={editing} onSubmit={handleUpdate} />
          <button onClick={() => setEditing(null)} style={{ marginTop: 8 }}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
