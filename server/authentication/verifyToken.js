var jwt = require('jsonwebtoken');
var config = require('../config');

verifyToken = (req, res, next) => {
    var token = req.headers['token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'Error: no tokens provided.' });
    }

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Error: Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;
