// tests/api.test.ts
import request from 'supertest';
import {app} from '../index'; 

describe('CRUD API Tests', () => {
  // Test data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
  };

  let createdUserId: number; // To store the created user's ID for later use;

  test('Create a new user', async () => {
    const response = await request(app).post('/users').send(user);
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    createdUserId = response.body.id;
  });

  test('Get user by ID', async () => {
    const response = await request(app).get(`/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(user);
  });

  test('Update user', async () => {
    const updatedData = { age: 31 };
    const response = await request(app).put(`/users/${createdUserId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.age).toBe(updatedData.age);
  });

  test('Delete user', async () => {
    const response = await request(app).delete(`/users/${createdUserId}`);
    expect(response.status).toBe(200);
  });

  test('Attempt to get deleted user', async () => {
    const response = await request(app).get(`/users/${createdUserId}`);
    expect(response.status).toBe(404);
  });
});
