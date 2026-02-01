const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const { verifyToken } = require('./services/authentication');
const Blog = require('./models/blog');
const Comment = require('./models/comment');

const app = express();

/* ---------- DB ---------- */
mongoose.connect('mongodb://localhost:27017/blogify')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

/* ---------- VIEW ENGINE ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- MIDDLEWARE ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* ---------- GLOBAL USER ---------- */
app.use((req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    const user = verifyToken(token);
    if (user) res.locals.user = user;
  }
  next();
});

/* ---------- ROUTES ---------- */
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);



app.get('/', async (req, res) => {
  const blogs = await Blog.find()
    .populate('author', 'fullname')
    .sort({ createdAt: -1 });

  const blogsWithCounts = await Promise.all(
    blogs.map(async blog => {
      const count = await Comment.countDocuments({ blog: blog._id });
      return { ...blog.toObject(), commentCount: count };
    })
  );

  res.render('homepage', { blogs: blogsWithCounts });
});


app.listen(8000, () => console.log('Server running on 8000'));
