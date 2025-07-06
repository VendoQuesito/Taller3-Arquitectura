const request = require('supertest');

const API = 'http://localhost:3001';

describe('E2E Usuarios - API Gateway', () => {
  let userId;

  test('Crear usuario - éxito', async () => {
    const res = await request(API).post('/usuarios').send({
      name: "test",
      lastName: "tester",
      email: "test.com",
      password: "1234567",
      confirmPassword: "1234567"
    });
    expect(res.statusCode).toBe(201);
    userId = res.body.id;
  });

  test('Crear usuario - error (email duplicado)', async () => {
    const res = await request(API).post('/usuarios').send({
      name: "test",
      lastName: "tester",
      email: "test.com",
      password: "1234567",
      confirmPassword: "1234567"
    });
    expect(res.statusCode).toBe(400);
  });

  test('Login - éxito', async () => {
    const res = await request(API).post('/auth/login').send({
      email: 'test.com',
      password: '1234567'
    });
    expect(res.statusCode).toBe(200);
  });

  test('Login - error (credenciales inválidas)', async () => {
    const res = await request(API).post('/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
  });

  test('Obtener usuario por ID - éxito', async () => {
    const res = await request(API).get(`/usuarios/${userId}`);
    expect(res.statusCode).toBe(200);
  });

  test('Obtener usuario por ID - error (ID inválido)', async () => {
    const res = await request(API).get('/usuarios/invalid-id');
    expect(res.statusCode).toBe(404);
  });

  test('Actualizar usuario - éxito', async () => {
    const res = await request(API).patch(`/usuarios/${userId}`).send({ nombre: 'Nuevo Nombre' });
    expect(res.statusCode).toBe(200);
  });

  test('Actualizar usuario - error (ID inválido)', async () => {
    const res = await request(API).patch(`/usuarios/invalid-id`).send({ nombre: 'Fail' });
    expect(res.statusCode).toBe(404);
  });

  test('Listar usuarios - éxito', async () => {
    const res = await request(API).get('/usuarios');
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar usuario - éxito', async () => {
    const res = await request(API).delete(`/usuarios/${userId}`);
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar usuario - error (ID inválido)', async () => {
    const res = await request(API).delete('/usuarios/invalid-id');
    expect(res.statusCode).toBe(404);
  });
});
