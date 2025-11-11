import request from 'supertest';
import app from '../app.js';
import { Usuario } from '../models/index.js';
import bcryptjs from 'bcryptjs';

describe('Usuarios Routes', () => {
  describe('POST /api/usuarios/login', () => {
    it('should return 400 if correo is missing', async () => {
      const res = await request(app)
        .post('/api/usuarios/login')
        .send({ password: 'test123' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/usuarios/login')
        .send({ correo: 'test@test.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 if user not found', async () => {
      const res = await request(app)
        .post('/api/usuarios/login')
        .send({ correo: 'nonexistent@test.com', password: 'test123' });

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 if password is incorrect', async () => {
      // This test assumes admin@oasis.com exists from seed
      const res = await request(app)
        .post('/api/usuarios/login')
        .send({ correo: 'admin@oasis.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
    });

    it('should return token if credentials are correct', async () => {
      const res = await request(app)
        .post('/api/usuarios/login')
        .send({ correo: 'admin@oasis.com', password: 'admin123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toBeTruthy();
    });
  });

  describe('POST /api/usuarios/register', () => {
    it('should return 400 if nombre is missing', async () => {
      const res = await request(app)
        .post('/api/usuarios/register')
        .send({ 
          correo: 'newuser@test.com', 
          password: 'test123' 
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if correo is missing', async () => {
      const res = await request(app)
        .post('/api/usuarios/register')
        .send({ 
          nombre: 'Test User', 
          password: 'test123' 
        });

      expect(res.statusCode).toBe(400);
    });

    it('should create a new user successfully', async () => {
      const uniqueEmail = `newuser${Date.now()}@test.com`;
      const res = await request(app)
        .post('/api/usuarios/register')
        .send({ 
          nombre: 'Test User', 
          correo: uniqueEmail, 
          password: 'test123' 
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.correo).toBe(uniqueEmail);
    });

    it('should return 400 if email already exists', async () => {
      const res = await request(app)
        .post('/api/usuarios/register')
        .send({ 
          nombre: 'Duplicate User', 
          correo: 'admin@oasis.com', 
          password: 'test123' 
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
