const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('./db/mongoose');

const router = require('./router');
const swaggerDocument = require('./swagger.json');
const { MOUNT_POINT = '' } = process.env;

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(MOUNT_POINT, router);

module.exports = app;