import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import sequelize from './db.js';
import Usuario from './models/Usuario.js';
import Escenario from './models/Escenario.js';
import Reserva from './models/Reserva.js';

dotenv.config();

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD. Ejecutando seed...');

    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('Tablas creadas.');

    const escenarios = [
      { nombre: 'Coliseo', capacidad: 100 },
      { nombre: 'Cancha Sintética', capacidad: 30 },
      { nombre: 'Cancha de Césped', capacidad: 30 },
    ];

    for (const e of escenarios) {
      const [row, created] = await Escenario.findOrCreate({ where: { nombre: e.nombre }, defaults: e });
      console.log(`${created ? 'Creado' : 'Existe'} escenario: ${row.nombre}`);
    }

    // Crear admin (forzar recreación para asegurar credenciales correctas)
    const adminEmail = 'admin@oasis.com';
    const adminPass = 'admin123';
    
    // Eliminar admin existente si hay
    await Usuario.destroy({ where: { correo: adminEmail } });
    
    // Crear nuevo admin
    const admin = await Usuario.create({ 
      nombre: 'Administrador', 
      correo: adminEmail, 
      password: bcrypt.hashSync(adminPass, 10), // Generar hash fresco
      rol: 'admin' 
    });

    // Verificar que se pueda hacer login
    const testHash = admin.password;
    const testLogin = bcrypt.compareSync(adminPass, testHash);
    if (!testLogin) {
      console.error('ADVERTENCIA: Error en la verificación de contraseña del admin');
    } else {
      console.log('Verificación de contraseña del admin: OK');
    }
    console.log('\n========= CREDENCIALES DEL ADMINISTRADOR =========');
    console.log('Email:', adminEmail);
    console.log('Contraseña:', adminPass);
    console.log('IMPORTANTE: Guarde estas credenciales. Las necesitará');
    console.log('           para acceder como administrador.');
    console.log('===============================================\n');
    console.log('Usuario administrador creado/actualizado correctamente');

    console.log('Seed finalizado.');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err);
    process.exit(1);
  }
}

seed();
