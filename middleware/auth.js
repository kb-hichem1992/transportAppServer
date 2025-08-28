const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, config.jwt.secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = payload;
    next();
  });
}

module.exports = { authenticateToken };
