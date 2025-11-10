import React, { useState, useEffect } from "react";

const SLOTS = [
  { label: "08:00 - 10:00", value: "08:00:00" },
  { label: "10:00 - 12:00", value: "10:00:00" },
  { label: "14:00 - 16:00", value: "14:00:00" },
  { label: "16:00 - 18:00", value: "16:00:00" },
  { label: "18:00 - 20:00", value: "18:00:00" },
];

export default function ReservaForm({ escenarios = [], onSubmit, initial = {}, selectedId }) {
  const [escenarioId, setEscenarioId] = useState(initial.escenarioId ?? (selectedId ?? (escenarios[0]?.id ?? "")));
  const [fecha, setFecha] = useState(initial.fecha ?? new Date().toISOString().slice(0, 10));
  const [hora_inicio, setHora_inicio] = useState(initial.hora_inicio ?? SLOTS[0].value);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si cambia el selectedId (por selección en Dashboard), actualizar el escenario
    if (selectedId && selectedId !== escenarioId) setEscenarioId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    // Si se proporciona un initial con escenario diferente, sincronizar
    if (initial && initial.escenarioId && initial.escenarioId !== escenarioId) {
      setEscenarioId(initial.escenarioId);
    }
  }, [initial]);

  const submit = (e) => {
    e.preventDefault();
    setError("");

    // Validar que se haya seleccionado un escenario
    const chosenEscenario = escenarioId ?? selectedId;
    if (!chosenEscenario) {
      setError('Por favor selecciona un escenario');
      return;
    }

    // Validar que la fecha no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(fecha + "T00:00:00");
    
    if (selectedDate < today) {
      setError('No puedes reservar para una fecha pasada');
      return;
    }

    onSubmit({ escenarioId: Number(chosenEscenario), fecha, hora_inicio, duracion_minutos: 120 });
  };

  return (
    <div>
      <form onSubmit={submit} className="form-inner">
        {/* Mostrar selector de escenario si hay opciones (para crear o editar) */}
        {escenarios && escenarios.length > 0 && (
          <select className="input" value={escenarioId ?? (selectedId ?? "")} onChange={(e) => setEscenarioId(e.target.value)}>
            <option value="" disabled>Selecciona un escenario</option>
            {escenarios.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        )}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="input"
          min={new Date().toISOString().slice(0, 10)}
        />
        <select 
          value={hora_inicio}
          onChange={(e) => setHora_inicio(e.target.value)}
          className="input"
        >
          {SLOTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button type="submit" className="btn btn-primary">
          Reservar
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
