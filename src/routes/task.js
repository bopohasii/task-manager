const { Router } = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = new Router();

/* Task */
router.post('/tasks', auth,  async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();

    res.send(task);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    const { completed, limit = '10', skip = '0', sortBy } = req.query;
    const match = {};
    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort: {}
    };

    if (completed) {
      match.completed = (completed === 'true');
    }

    if (sortBy) {
      const parts = sortBy.split(':');
      options.sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({ owner: req.user._id, ...match }, null, options);
    // const tasks = await req.user.populate('tasks').execPopulate();

    res.send(tasks);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const { params, user } = req;

    const task = Task.findOne({ _id: params.id, owner: user._id });

    if (!task) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send(task);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update => allowedUpdates.includes(update)));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  try {
    const { params, user } = req;
    const task = await Task.findOne({ _id: params.id, owner: user._id });

    if (!task) {
      return res.status(404).send({ error: 'Task not found.' });
    }

    updates.forEach(update => task[update] = req.body[update]);

    await task.save();

    res.send(task);
  } catch(error) {
    res.status(500).send(error)
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const { params, user } = req;

    const task = await Task.findOneAndDelete({ _id: params.id, owner: user._id });
    if (!task) {
      return res.status(404).send({ error: 'Task not found.' });
    }

    res.send();
  } catch(error) {
    res.status(500).send(error);
  }
});


module.exports = router;