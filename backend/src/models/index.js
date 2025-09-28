import Usuario from "./Usuario.js";
import Escenario from "./Escenario.js";
import Reserva from "./Reserva.js";

// Relaciones
Usuario.hasMany(Reserva, { foreignKey: "usuarioId" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId" });

Escenario.hasMany(Reserva, { foreignKey: "escenarioId" });
Reserva.belongsTo(Escenario, { foreignKey: "escenarioId" });

export { Usuario, Escenario, Reserva };
