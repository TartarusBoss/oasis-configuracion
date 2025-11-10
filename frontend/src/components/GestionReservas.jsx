import React, { useEffect, useState } from "react";
import { getReservas, getReservasByUsuario, deleteReserva, updateReserva, getEscenarios } from "../api";
import ReservaForm from "./ReservaForm";

export default function GestionReservas({ user }) {
  const [historial, setHistorial] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escenarios, setEscenarios] = useState([]);
  const [success, setSuccess] = useState("");

  async function fetchHistorial() {
    setLoading(true);
    try {
      // Si es admin, obtener todas las reservas
      if (user.rol === 'admin') {
        const res = await getReservas({}, user.token);
        setHistorial(res.data);
      } else {
        // Si es usuario normal, solo sus reservas
        const res = await getReservasByUsuario(user.id, user.token);
        setHistorial(res.data);
      }
    } catch (err) {
      setError("No se pudo cargar historial");
    } finally {
      setLoading(false);
    }
  }

  async function fetchEscenarios() {
    try {
      const r = await getEscenarios();
      setEscenarios(r.data);
    } catch (err) {
      console.warn('No se pudieron obtener escenarios', err);
    }
  }

  useEffect(() => { fetchHistorial(); fetchEscenarios(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    
    setError(null);
    try {
      await deleteReserva(id, user.token);
      setSuccess('Eliminé esa reserva');
      // refrescar listado
      await fetchHistorial();
      // limpiar mensaje en 3s
      setTimeout(() => setSuccess(''), 3000);
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

  if (loading) return <div className="card">Cargando historial...</div>;

  return (
    <div className="card">
      <h3>{user.rol === 'admin' ? 'Gestión de Reservas' : 'Mis Reservas'}</h3>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {historial.length === 0 ? (
        <p>{user.rol === 'admin' ? 'No hay reservas en el sistema' : 'No tienes reservas activas'}</p>
      ) : (
        <ul className="reservas-list">
          {historial.map(r => (
            <li key={r.id} className="reserva-item">
              <div className="reserva-info">
                <h4>{r.Escenario?.nombre}</h4>
                {user.rol === 'admin' && r.Usuario && (
                  <p><strong>Usuario:</strong> {r.Usuario.nombre} ({r.Usuario.correo})</p>
                )}
                <p>Fecha: {r.fecha} - Hora: {r.hora_inicio}</p>
              </div>
              <div className="reserva-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleEdit(r)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleCancel(r.id)}
                >
                  Cancelar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="modal-overlay">
            <div className="card">
            <h4>Editar reserva de {editing.Escenario?.nombre}</h4>
            <ReservaForm 
              escenarios={escenarios.length ? escenarios : [editing.Escenario]} 
              initial={editing} 
              onSubmit={handleUpdate} 
              selectedId={editing.escenarioId} 
            />
            <button 
              className="btn btn-secondary" 
              onClick={() => setEditing(null)} 
              style={{ marginTop: 12 }}
            >
              Cancelar edición
            </button>
          </div>
        </div>
      )}
    </div>
  );
}