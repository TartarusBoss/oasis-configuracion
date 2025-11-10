import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import GestionReservas from "./components/GestionReservas";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [mode, setMode] = useState('login');
  const [activePanel, setActivePanel] = useState('reservar'); // 'reservar' o 'gestionar'

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <Navbar user={user} onLogout={() => setUser(null)} />

      {!user ? (
        <div className="center">
          <div className="card form-card">
            <div className="tabs">
              <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Iniciar sesión</button>
              <button className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Registro</button>
            </div>
            <div style={{ marginTop: 12 }}>
              {mode === 'login' ? (
                <Login onLogin={(u) => setUser(u)} />
              ) : (
                <Register onRegister={(u) => setUser(u)} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <h2>Bienvenido, {user.nombre}</h2>
          
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activePanel === 'reservar' ? 'active' : ''}`}
              onClick={() => setActivePanel('reservar')}
            >
              Hacer Reserva
            </button>
            <button 
              className={`nav-tab ${activePanel === 'gestionar' ? 'active' : ''}`}
              onClick={() => setActivePanel('gestionar')}
            >
              Gestionar Reservas
            </button>
          </div>

          <div className="panel">
            {activePanel === 'reservar' ? (
              <Dashboard user={user} />
            ) : (
              <GestionReservas user={user} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
