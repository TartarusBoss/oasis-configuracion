import React, { useEffect, useState } from "react";
import { getReservas, createReserva, getEscenarios } from "../api";
import ReservaForm from "./ReservaForm";
import EscenariosList from "./EscenariosList";

export default function Dashboard({ user }) {
  const [reservas, setReservas] = useState([]);
  const [escenarios, setEscenarios] = useState([]);
  const [escenarioId, setEscenarioId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchReservas() {
    setLoading(true);
    try {
      const res = await getReservas();
      setReservas(res.data);
    } catch (err) {
      setError("No se pudieron obtener reservas");
    } finally { setLoading(false); }
  }

  async function fetchEscenarios() {
    try {
      const r = await getEscenarios();
      setEscenarios(r.data);
    } catch (err) {
      console.warn('No se pudieron obtener escenarios', err);
    }
  }

  useEffect(() => { fetchReservas(); fetchEscenarios(); }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      await createReserva(payload, user.token);
      await fetchReservas();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear reserva");
    }
  };

  return (
    <div className="container">
      <h3>Panel de reservas</h3>
      
      {/* Grid de escenarios */}
      <div className="card">
        <h4>Selecciona un escenario</h4>
        {escenarios.length === 0 ? (
          <p>Cargando escenarios...</p>
        ) : (
          <EscenariosList 
            escenarios={escenarios} 
            selected={escenarios.find(e => e.id === Number(escenarioId))?.id} 
            onSelect={id => setEscenarioId(id)} 
          />
        )}
      </div>
      
      {/* Formulario y reservas */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="card">
            <h4>Crear reserva</h4>
            <ReservaForm escenarios={escenarios} onSubmit={handleCreate} selectedId={escenarioId} />
            {error && <div className="error">{error}</div>}
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div className="card">
            <h4>Reservas actuales</h4>
            {loading ? <div>Cargando...</div> : (
              reservas.length === 0 ? (
                <p>No hay reservas para mostrar</p>
              ) : (
                <ul className="reservas-list">
                  {reservas.map(r => (
                    <li key={r.id}>
                      <strong>{r.Usuario?.nombre}</strong> — {r.Escenario?.nombre} — {r.fecha} — {r.hora_inicio}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
