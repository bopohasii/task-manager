const { ObjectID, MongoClient } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

const id = new ObjectID();
console.log(id);

MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect');
  }

  const db = client.db(dbName);

  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'leon',
  //   age: 11
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert tasks');
  //   }
  //
  //   console.log(result.ops);
  // })

  // db.collection('users').find({
  //   name: 'Bohdan',
  // }).toArray((error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert tasks');
  //   }
  //
  //   console.log(result);
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'buy milk',
  //     completed: true
  //   }, {
  //     description: 'clear floor',
  //     completed: true
  //   }, {
  //     description: 'read book',
  //     completed: false
  //   },
  //
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert tasks');
  //   }
  //
  //   console.log(result.ops);
  // })

  // db.collection('tasks').findOne({
  //   description: 'buy milk',
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert tasks');
  //   }
  //
  //   console.log(result);
  // });
  //
  // db.collection('tasks').find({
  //   completed: true,
  // }).toArray((error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert tasks');
  //   }
  //
  //   console.log(result);
  // })

  // db.collection('tasks').updateOne({
  //   _id: new ObjectID('5e3074cf069bd56b9aa26505')
  // }, {
  //   $set: {
  //     completed: true,
  //   }
  // }).then(result => console.log(result))

  db.collection('tasks').deleteOne({
    completed: true
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  })
});