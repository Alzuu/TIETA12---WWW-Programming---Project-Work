const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: 'Error: no tokens provided.' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Error: Failed to authenticate token.' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
