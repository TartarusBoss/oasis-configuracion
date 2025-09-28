import { useEffect, useState } from "react";
import { getHello, getReservas } from "./api";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    getHello().then(res => setMensaje(res.data.message));
    getReservas().then(res => setReservas(res.data));
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>{mensaje || "Cargando..."}</h1>
      <h2>📅 Reservas desde la BD:</h2>
      <ul>
        {reservas.map(r => (
          <li key={r.id}>
            <strong>{r.Usuario?.nombre}</strong> reservó <em>{r.Escenario?.nombre}</em> el {r.fecha} a las {r.hora_inicio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
