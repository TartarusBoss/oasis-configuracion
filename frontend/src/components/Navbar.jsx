import React from "react";

export default function Navbar({ user, onLogout }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontWeight: "bold", fontSize: 20 }}>Oasis Reservas</div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 10 }}>{user.nombre}</span>
            <button onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <span>Por favor inicia sesión</span>
        )}
      </div>
    </div>
  );
}
