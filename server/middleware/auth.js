const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'dev-only-secret-change-me';
const signToken = (id) => jwt.sign({ id: String(id) }, secret(), { expiresIn: '7d' });

// Requires "Authorization: Bearer <token>" and sets req.userId
function auth(req, res, next) {
  const h = req.header('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please sign in to continue' });
  try {
    req.userId = jwt.verify(token, secret()).id;
    next();
  } catch {
    res.status(401).json({ message: 'Your session expired. Please sign in again' });
  }
}

module.exports = { auth, signToken };