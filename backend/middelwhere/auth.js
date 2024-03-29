const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const expiresIn = 60 * 60 * 24; // 1 day in seconds
  const token = jwt.sign({ userId: req.params.id }, 'secretKey', { expiresIn: expiresIn });
  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // console.log('req', req.params);
    // console.log('decoded', decoded);
    req.params.id = decoded.userId; 
    next();
  });
};
const authenticateAdmin = (req, res, next) => {
  if (req.params.role !== 'admin') {
     return res.status(403).json({ message: 'Admin role required' });
  }
  next() 
 }
 
 const authenticateAnimateur = (req, res, next) => {
  if (req.params.role !== 'animateur') {
     return res.status(403).json({ message: 'animateur role required' })
  }
  next()
 }
 
 const authenticateManager = (req, res, next) => {
  if (req.params.role !== 'manager') {
     return res.status(403).json({ message: 'manager role required' })
  }
  next()
 }

module.exports = {
  authenticateUser, authenticateAdmin,authenticateAnimateur, authenticateManager
};