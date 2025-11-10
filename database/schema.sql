-- Schema para oasis-configuracion
-- Tablas: usuarios, escenarios, reservas

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS escenarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  capacidad INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  escenarioId INT NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  duracion_minutos INT NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_reserva_escenario FOREIGN KEY (escenarioId) REFERENCES escenarios(id) ON DELETE CASCADE
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_reservas_escenario_fecha ON reservas (escenarioId, fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas (usuarioId);

-- NOTA: No se insertan seeds por ahora; ejecutar scripts de seed en un paso separado cuando se requiera.
