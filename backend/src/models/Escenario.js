import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Escenario = sequelize.define(
  "Escenario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "escenarios",
    timestamps: false,
  }
);

export default Escenario;
