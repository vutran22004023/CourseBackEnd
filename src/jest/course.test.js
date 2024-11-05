import { app, server, redisClient } from '../server.js';
import supertest from 'supertest';

const request = supertest(app);
var course;

afterAll(async () => {
  await server.close();
  await redisClient.disconnect();
});

describe('Course endpoints', () => {
  it('GET /api/course/all-courses should return all courses', async () => {
    const res = await request.get('/api/course/all-courses');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toMatchObject({
      status: 200,
      message: expect.any(String),
      data: expect.any(Array),
      total: expect.any(Number),
      pageCurrent: expect.any(Number),
      totalPage: expect.any(Number),
    });
    if (res.body.status == 200 && res.body.data.length > 0) {
      course = res.body.data[0];
    }
  });

  it('GET /api/course/detail-courses/not-login/{slug} should return a course detail', async () => {
    const res = await request.get(`/api/course/detail-courses/not-login/${course.slug}`);
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toMatchObject({
      status: 200,
      message: expect.any(String),
      data: expect.any(Object),
    });
  });

  it("GET /api/course/detail-courses/{slug} shouldn't return a course detail without login", async () => {
    const res = await request.get(`/api/course/detail-courses/${course.slug}`);
    expect(res.status).toEqual(401);
  });
});
