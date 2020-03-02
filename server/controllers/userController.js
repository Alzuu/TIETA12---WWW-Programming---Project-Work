const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xssFilters = require('xss-filters');

const config = require('../config.js');

var User = require('../models/User');
const saltRounds = 12;

exports.list = (req, res, next) => {
  User.find(function(err, foundUsers) {
    if (err) {
      res.sendStatus(404);
      return console.error(err);
    };
    res.status(200);
    res.json(foundUsers);
  });
}

exports.one = (req, res, next) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      res.sendStatus(404);
      return console.error(err);
    }
    res.status(200);
    res.json(foundUser);
  });
};

exports.modify = (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    name: xssFilters.inHTMLData(req.body.name),
    role: parseInt(xssFilters.inHTMLData(req.body.role)),
  }, (err, user) => {    
    if (err) {
      res.sendStatus(400);
      return console.error(err);
    };
    res.status(200);
    res.json(user);
  });
}

exports.create = (req, res, next) => {
  var password = xssFilters.inHTMLData(req.body.password);

  bcrypt.hash(password, saltRounds, function(err, hash) {
    var newUser = new User({
      name: xssFilters.inHTMLData(req.body.name),
      role: parseInt(xssFilters.inHTMLData(req.body.role)),
      password: hash
    });

    newUser.save(function(err) {
      if (err) {
        res.sendStatus(400);
        return console.error(err);
      };
      res.status(201);
      res.json(newUser);
    });
  });
}

exports.delete = (req, res, next) => {
  User.deleteMany((err, users) => {
      if (err) {
          res.sendStatus(404);
          return console.error(err);
      };
      if (!users) {
          res.sendStatus(404)
      } else {
          res.status(204);
          res.json();
      }
  });
}

exports.deleteOne = (req, res, next) => {
  User.findByIdAndDelete(req.params.id, function(err, user) {
      if (err) {
          res.sendStatus(404);
          return console.error(err);
      };
      if (!user) {
          res.sendStatus(404)
      } else {
          res.status(204);
          res.json();
      }
  });
}

exports.login = (req, res, next) => {
  User.findOne({ name: req.body.name }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({ 
      auth: true,
      token,
    });
    res.end(json);
  });
}

exports.logout = (req, res, next) => {
  res.status(200).send({ auth: false, token: null });
}