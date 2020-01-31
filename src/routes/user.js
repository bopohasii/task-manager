const { Router } = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = new Router();
const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only available jpg|jpeg|png'))
    }

    cb(undefined, true)
  }
});

/* User */
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    sendWelcomeEmail(user.email, user.name);

    res.status(201).send({ user, token });
  } catch(error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch(error) {
    res.status(404).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    const { user, token } = req;

    user.tokens = user.tokens.filter(userToken => userToken.token !== token);

    await user.save();

    res.send();
  } catch(error) {
    res.status(500).send(error);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    const { user } = req;

    user.tokens = [];

    await user.save();

    res.send();
  } catch(error) {
    res.status(500).send(error);
  }
});

// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find({});
//
//     res.send(users);
//   } catch(error) {
//     res.status(500).send(error);
//   }
// });

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const { user, file } = req;

  user.avatar = await sharp(file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

  await user.save();

  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error });
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-type', 'image/jpg').send(user.avatar);
  } catch(error) {
    res.status(404).send();
  }
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  const { user } = req;

  req.user.avatar = undefined;
  await user.save();

  res.send();
}, (error, req, res, next) => {
  res.status(400).send({ error });
});

// router.get('/users/:id', async (req, res) => {
//   try {
//     const user = User.findById({ _id: req.params.id });
//
//     if (!user) {
//       return res.status(404).send();
//     }
//
//     res.send(user);
//   } catch(error) {
//     res.status(500).send(error);
//   }
// });

// router.patch('/users/:id', async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['name', 'email', 'password', 'age'];
//   const isValidOperation = updates.every((update => allowedUpdates.includes(update)));
//
//   if (!isValidOperation) {
//     return res.send(400).error({ error: 'Invalid request' });
//   }
//
//   try {
//     const user = await User.findById(req.params.id);
//
//     updates.forEach(update => user[update] = req.body[update]);
//
//     await user.save();
//
//     if (!user) {
//       return res.status(404).send();
//     }
//
//     res.send(user);
//   } catch(error) {
//     res.status(500).send(error);
//   }
// });

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update => allowedUpdates.includes(update)));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  try {
    const { user } = req;

    updates.forEach(update => user[update] = req.body[update]);

    await user.save();

    res.send(user);
  } catch(error) {
    res.status(500).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    const { user } = req;
    await user.remove();

    sendCancellationEmail(user.email, user.name);

    res.send(user);
  } catch(error) {
    res.status(500).send(error);
  }
});

module.exports = router;