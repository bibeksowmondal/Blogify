// services/authentication.js

const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET not defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

/* =========================
   Create JWT Token
   ========================= */
function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

/* =========================
   Verify JWT Token
   ========================= */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return 'expired';
    }
    return null;
  }
}

/* =========================
   Require Authentication
   ========================= */
function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/user/signin');
  }

  const user = verifyToken(token);

  if (!user || user === 'expired') {
    res.clearCookie('token');
    return res.redirect('/user/signin');
  }

  req.user = user;
  next();
}

/* =========================
   Role-Based Authorization
   ========================= */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
}

module.exports = {
  createToken,
  verifyToken,
  requireAuth,
  requireRole
};