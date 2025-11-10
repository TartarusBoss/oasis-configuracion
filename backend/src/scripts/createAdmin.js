import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import "../db.js";

async function createAdmin() {
  try {
    const adminData = {
      nombre: "Administrador",
      correo: "admin@oasis.com",
      password: bcrypt.hashSync("admin123", 10),
      rol: "admin"
    };

    const existingAdmin = await Usuario.findOne({ 
      where: { correo: adminData.correo } 
    });

    if (existingAdmin) {
      console.log("El usuario administrador ya existe");
      return;
    }

    await Usuario.create(adminData);
    console.log("Usuario administrador creado exitosamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  } finally {
    process.exit();
  }
}

createAdmin();