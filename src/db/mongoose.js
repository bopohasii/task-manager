const mongoose = require('mongoose');

const logger = require('../utils/logger');

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
mongoose.connection.on('open', () => {
  logger.log('info', "[STARTUP] MongoDB connection SUCCESS", {tags: 'startup,mongo'});
});

mongoose.connection.on('error', () => {
  logger.error('info', "[STARTUP] MongoDB connection FAILURE", {tags: 'startup,mongo'});
});

