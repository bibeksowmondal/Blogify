const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { createToken } = require('../services/authentication');

const router = Router();

/* ================= SIGNUP ================= */
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const user = new User({ fullname, email, password });
    await user.save();

    // auto login after signup
    const token = createToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    return res.redirect('/');
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).render('signup', {
        error: 'Email already exists'
      });
    }

    return res.status(500).render('signup', {
      error: 'Something went wrong'
    });
  }
});

/* ================= SIGNIN ================= */
router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('signin', {
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('signin', {
        error: 'Invalid email or password'
      });
    }

    const token = createToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.status(500).render('signin', {
      error: 'Something went wrong'
    });
  }
});

/* ================= LOGOUT ================= */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.redirect('/user/signin');
});

module.exports = router;
