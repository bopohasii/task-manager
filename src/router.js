const { Router } = require('express');

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const router = Router();

router.use([
  userRouter,
  taskRouter
]);

module.exports = router;