const request = require('supertest');
const API = 'http://localhost:3001';

describe('E2E Usuarios - API Gateway', () => {
  let userId;
  let token;

  test('Crear usuario - éxito', async () => {
    const res = await request(API).post('/users').send({
      name: "test",
      lastName: "tester",
      email: "test.com",
      password: "1234567",
      confirmPassword: "1234567",
      rol: "Cliente"
    });
    console.log("Crear usuario éxito - Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(201);
    userId = res.body.id || res.body._id;
  });

  test('Crear usuario - error (email duplicado)', async () => {
    const res = await request(API).post('/users').send({
      name: "test",
      lastName: "tester",
      email: "test.com",
      password: "1234567",
      confirmPassword: "1234567",
      rol: "Cliente"
    });
    console.log("Duplicado - Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(500);
  });

  test('Login - éxito', async () => {
    const res = await request(API).post('/auth/login').send({
      email: 'test.com',
      password: '1234567'
    });
    console.log("Login éxito - Response:", res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  test('Login - error (credenciales inválidas)', async () => {
    const res = await request(API).post('/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(500);
  });

  test('Obtener usuario por ID - éxito', async () => {
    const res = await request(API)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('Obtener usuario por ID - error (ID inválido)', async () => {
    const res = await request(API)
      .get('/users/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  test('Actualizar usuario - éxito', async () => {
    const res = await request(API)
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Nuevo Nombre' });
    expect(res.statusCode).toBe(200);
  });

  test('Actualizar usuario - error (ID inválido)', async () => {
    const res = await request(API)
      .patch('/users/invalid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Fail' });
    expect(res.statusCode).toBe(404);
  });

  test('Listar usuarios - éxito', async () => {
    const res = await request(API)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar usuario - éxito', async () => {
    const res = await request(API)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('Eliminar usuario - error (ID inválido)', async () => {
    const res = await request(API)
      .delete('/users/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
