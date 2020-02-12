const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
require('./db/mongoose');

const router = require('./router');
const swaggerDocument = require('./swagger.json');
const { MOUNT_POINT, NODE_ENV, PORT } = process.env;

const app = express();

app.set('port', PORT);
app.use(morgan('dev'));
app.use(express.json());

if (NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(MOUNT_POINT, router);

export = app;