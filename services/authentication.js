const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Create JWT token
 */
function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}


/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Middleware: Require authentication
 */
function requireAuth(req, res, next) {
  const token = req.cookies?.token; // 🍪 cookie-parser

  if (!token) {
    return res.redirect('/user/signin');
  }

  const user = verifyToken(token);
  if (!user) {
    res.clearCookie('token');
    return res.redirect('/user/signin');
  }

  req.user = user;
  return next();
}

/**
 * Middleware: Role-based authorization
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    return next();
  };
}

module.exports = {
  createToken,
  verifyToken,
  requireAuth,
  requireRole
};
