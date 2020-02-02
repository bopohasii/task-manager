const mongoose = require('mongoose');

console.log('MONGO', process.env.MONGO_DB_URL);

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(Error, err.message);
  });
