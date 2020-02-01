const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/Task');
const { userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db');
const { MOUNT_POINT } = process.env;

describe('Task API', () => {
  beforeEach(setupDatabase);

  test('should create task for user', async () => {
    const response = await request(app)
      .post(MOUNT_POINT + '/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: taskOne.description,
        completed: taskOne.completed,
      })
      .expect(200);

    const task = Task.findById(response.body._id);

    expect(task).not.toBeNull();
  });

  test('should fetch user tasks', async () => {
    const response = await request(app)
      .get(MOUNT_POINT + '/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    expect(response.body).toHaveLength(2);
  });

  test('should not delete another users task', async () => {
    await request(app)
      .delete(MOUNT_POINT + `/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);

    const task = Task.findById(taskOne._id);
    expect(task).not.toBeNull();
  })

});