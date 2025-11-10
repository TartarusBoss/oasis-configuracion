# Imagen base de Node
FROM node:18

# Crear directorio
WORKDIR /app

# Copiar archivos del backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Instalar MySQL client
RUN apt-get update && apt-get install -y default-mysql-client

# Copiar el código fuente del backend asegurando todos los subdirectorios
COPY backend/src /app/backend/src
COPY backend/init.sh ./init.sh

# Dar permisos a los scripts
RUN chmod +x /app/backend/init.sh

# Variables de entorno para producción
ENV NODE_ENV=production

# Exponer puerto
EXPOSE 4000

# Comando por defecto
CMD ["/app/backend/init.sh"]
