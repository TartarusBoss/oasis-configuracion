import React from "react";

export default function EscenariosList({ escenarios, onSelect, selected }) {
  return (
    <div className="escenarios-grid">
      {escenarios.map((escenario) => (
        <div
          key={escenario.id}
          className={`escenario-card ${escenario.id === selected ? 'selected' : ''}`}
          onClick={() => onSelect(escenario.id)}
        >
          <h4>{escenario.nombre}</h4>
          <p>Capacidad: {escenario.capacidad} personas</p>
        </div>
      ))}
    </div>
  );
}