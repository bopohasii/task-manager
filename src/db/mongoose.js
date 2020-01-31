const mongoose = require('mongoose');

const { MONGO_DB_URL, DB_NAME } = process.env;

mongoose.connect(`${MONGO_DB_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
