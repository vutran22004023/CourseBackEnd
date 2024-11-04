import { app, server, redisClient } from '../server.js';
import supertest from 'supertest';
import TestUtils from './common.js';

const request = supertest(app);

afterAll(async () => {
  await server.close();
  await redisClient.disconnect();
});

describe('Authentication endpoints', () => {
  it('POST /api/login-in should login', async () => {
    const loginData = {
      email: 'test@gmail.com',
      password: 'test123',
    };
    const res = await request.post('/api/login-in').send(loginData);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toMatchObject({
      access_Token: expect.any(String),
      refresh_Token: expect.any(String),
    });
  });

  test("POST /api/register shouldn't create a new user with invalid email", async () => {
    const user = {
      name: 'test',
      email: TestUtils.generateRandomEmail(),
      password: 'test123',
      confirmPassword: 'test123',
    };
    const res = await request.post('/api/register').send(user);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toMatchObject({
      status: 'ERR',
      message: expect.any(String),
    });
  });
});
