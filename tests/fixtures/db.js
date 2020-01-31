const faker = require('faker');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name:  faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name:  faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
  }]
};

const userThree = {
  name:  faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: faker.lorem.words(2),
  completed: faker.random.boolean(),
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: faker.lorem.words(2),
  completed: faker.random.boolean(),
  owner: userOne._id
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: faker.lorem.words(2),
  completed: faker.random.boolean(),
  owner: userTwo._id
};

const setupDatabase = async () => {
  await User.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();

  await Task.deleteMany({});
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userTwo,
  userThree,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
};