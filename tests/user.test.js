const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/User');
const { userOne, userTwo, userThree, setupDatabase } = require('./fixtures/db');
const { MOUNT_POINT } = process.env;

describe('User API', () => {
  beforeEach(setupDatabase);

  test('should Sign up new user', async () => {
    await request(app)
      .post(MOUNT_POINT + '/users')
      .send(userThree)
      .expect(201);
  });

  test('should login existing user', async () => {
    const response = await request(app)
      .post(MOUNT_POINT + '/users/login')
      .send({
        email: userOne.email,
        password: userOne.password
      }).expect(200);

    const user = await User.findById(userOne._id);
    expect(response.body.token).toBe(user.tokens[1].token);
  });

  test('should not login non-existing user', async () => {
    await request(app)
      .post(MOUNT_POINT + '/users/login')
      .send({
        email: userOne.email,
        password: userOne.password + '_bad',
      })
      .expect(404);
  });

  test('should get user profile', async () => {
    await request(app)
      .get(MOUNT_POINT + '/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
  });

  test('should delete account for a user', async () => {
    await request(app)
      .delete(MOUNT_POINT + '/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
  });

  test('should not delete account for an unauthenticated user', async () => {
    await request(app)
      .delete(MOUNT_POINT + '/users/me')
      .send()
      .expect(401)
  });

  test('should upload avatar image', async () => {
    await request(app)
      .post(MOUNT_POINT + '/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/profile-pic.jpg')
      .expect(200);

    const user = await User.findById(userOne._id);

    expect(user.avatar).toEqual(expect.any(Buffer));
  });

  test('should update valid user field', async () => {
    await request(app)
      .patch(MOUNT_POINT + '/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: userTwo.name
      })
      .expect(200);

    const user = await User.findById(userOne._id);

    expect(user.name).toBe(userTwo.name);
  });

  test('should not update non-valid user field', async () => {
    await request(app)
      .patch(MOUNT_POINT + '/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        firstName: userTwo.name
      })
      .expect(400);
  });
});

