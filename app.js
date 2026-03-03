const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const { verifyToken } = require('./services/authentication');
const Blog = require('./models/blog');
const Comment = require('./models/comment');

const app = express();

/* ---------- DB ---------- */
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/blogify';

mongoose.connect(DB_URL)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Started 🚀");
    });
  })
  .catch(err => {
    console.error("MongoDB Connection Error ❌", err);
  });

/* ---------- VIEW ENGINE ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- MIDDLEWARE ---------- */
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* ---------- RATE LIMIT LOGIN ---------- */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});
app.use('/user/signin', loginLimiter);

/* ---------- GLOBAL USER ---------- */
app.use((req, res, next) => {
  const token = req.cookies?.token;

  if (token) {
    const user = verifyToken(token);

    if (user && user !== 'expired') {
      req.user = user;
      res.locals.user = user;
    } else {
      res.clearCookie('token');
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
});

/* ---------- ROUTES ---------- */
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

/* ---------- HOME ---------- */
app.get('/', async (req, res) => {
  const blogs = await Blog.find()
    .populate('author', 'fullname')
    .sort({ createdAt: -1 })
    .lean();

  const blogsWithCounts = await Promise.all(
    blogs.map(async blog => {
      const count = await Comment.countDocuments({ blog: blog._id });
      return { ...blog, commentCount: count };
    })
  );

  res.render('homepage', { blogs: blogsWithCounts });
});