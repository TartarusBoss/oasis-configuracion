# Imagen base de Node
FROM node:18

# Crear directorio
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "run", "dev"]
