import dotenv from "dotenv";
import app from "./app.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config(); // 👈 Esto siempre debe ir antes de usar variables de entorno

// 📜 Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Oasis",
      version: "1.0.0",
      description: "Documentación de la API del proyecto Oasis"
    },
  },
  apis: ["./src/routes/*.js"], // 👈 Cambia esta ruta si tus rutas están en otro lugar
};

// 📚 Generar documentación Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api/docs`);
});
