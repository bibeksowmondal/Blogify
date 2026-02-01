const { Router } = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const { requireAuth } = require('../services/authentication');

const router = Router();

/* ======================================================
   ADD BLOG
====================================================== */
router.get('/add', requireAuth, (req, res) => {
  res.render('addBlog');
});

router.post('/add', requireAuth, async (req, res) => {
  const { title, content, imageUrl } = req.body;

  await Blog.create({
    title,
    content,
    imageUrl: imageUrl || '',
    author: req.user.id
  });

  res.redirect('/');
});

/* ======================================================
   EDIT BLOG
====================================================== */
router.get('/edit/:id', requireAuth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send('Blog not found');

  if (blog.author.toString() !== req.user.id)
    return res.status(403).send('Unauthorized');

  res.render('editBlog', { blog });
});

router.post('/edit/:id', requireAuth, async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) return res.status(404).send('Blog not found');
  if (blog.author.toString() !== req.user.id)
    return res.status(403).send('Unauthorized');

  blog.title = title;
  blog.content = content;
  blog.imageUrl = imageUrl || '';
  await blog.save();

  res.redirect(`/blog/${blog._id}`);
});

/* ======================================================
   DELETE BLOG
====================================================== */
router.post('/delete/:id', requireAuth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.redirect('/');

  if (blog.author.toString() !== req.user.id)
    return res.status(403).send('Unauthorized');

  await Comment.deleteMany({ blog: blog._id });
  await blog.deleteOne();

  res.redirect('/');
});

/* ======================================================
   ADD COMMENT
====================================================== */
router.post('/:id/comment', requireAuth, async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blog: req.params.id,
    author: req.user.id,
    parentComment: req.body.parentComment || null
  });

  res.redirect(`/blog/${req.params.id}`);
});

/* ======================================================
   AJAX LIKE COMMENT
====================================================== */
router.post('/comment/like/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({});

  const userId = req.user.id;
  const index = comment.likes.indexOf(userId);

  let liked;
  if (index === -1) {
    comment.likes.push(userId);
    liked = true;
  } else {
    comment.likes.splice(index, 1);
    liked = false;
  }

  await comment.save();

  res.json({
    liked,
    likesCount: comment.likes.length
  });
});

/* ======================================================
   DELETE COMMENT
====================================================== */
router.post('/comment/delete/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.redirect('/');

  if (comment.author.toString() !== req.user.id)
    return res.status(403).send('Unauthorized');

  const blogId = comment.blog;

  await Comment.deleteMany({
    $or: [
      { _id: comment._id },
      { parentComment: comment._id }
    ]
  });

  res.redirect(`/blog/${blogId}`);
});

/* ======================================================
   BLOG DETAIL  ⚠️ MUST BE LAST
====================================================== */
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'fullname');

  if (!blog) return res.status(404).send('Blog not found');

  const comments = await Comment.find({
    blog: blog._id,
    parentComment: null
  }).populate('author', 'fullname');

  const replies = await Comment.find({
    blog: blog._id,
    parentComment: { $ne: null }
  }).populate('author', 'fullname');

  res.render('blogDetail', { blog, comments, replies });
});

module.exports = router;
