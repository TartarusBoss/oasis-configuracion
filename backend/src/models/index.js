import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql", // 👈 IMPORTANTE
    logging: false,
  }
);

export const Usuario = sequelize.define(
  "usuarios",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    rol: DataTypes.STRING,
  },
  { timestamps: false }
);

export const Escenario = sequelize.define(
  "escenarios",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
    capacidad: DataTypes.INTEGER,
  },
  { timestamps: false }
);

export const Reserva = sequelize.define(
  "reservas",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: DataTypes.DATEONLY,
    hora_inicio: DataTypes.TIME,
    duracion_minutos: DataTypes.INTEGER,
    estado: DataTypes.STRING,
  },
  { timestamps: false }
);

Usuario.hasMany(Reserva, { foreignKey: "usuarioId" });
Reserva.belongsTo(Usuario, { foreignKey: "usuarioId" });

Escenario.hasMany(Reserva, { foreignKey: "escenarioId" });
Reserva.belongsTo(Escenario, { foreignKey: "escenarioId" });
