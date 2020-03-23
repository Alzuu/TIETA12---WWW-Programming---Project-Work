const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xssFilters = require('xss-filters');

const config = require('../config.js');
const Item = require('../models/Item');
const UserRole = require('../models/UserRole');
const { exportItemsToLinks } = require('./itemController');
var User = require('../models/User');
const saltRounds = 12;

function userToLinks(user, currentURL) {
  const result = [
    {
      rel: 'self',
      method: 'GET',
      href: `${currentURL}/${user._id}`,
      types: ['application/json'],
    },
    {
      rel: 'self',
      method: 'DELETE',
      href: `${currentURL}/${user._id}`,
      types: ['application/json'],
    },
    {
      rel: 'self',
      method: 'PUT',
      href: `${currentURL}/${user._id}`,
      types: ['application/json'],
    },
  ];
  return result;
}

getCurrentUrl = (req) =>
  `${req.protocol}://${req.get('host')}${req.originalUrl}`;

userIsAdmin = (req) => (req.userRole === UserRole.ADMIN);

usersToLinks = (users, currentURL) => {
  const result = [];
  users.forEach((user) => {
    const userJson = JSON.parse(JSON.stringify(user));
    userJson.links = userToLinks(user, currentURL);
    result.push(userJson);
  });
  return result;
};

exports.list = (req, res, next) => {
  if (!userIsAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  User.find(function(err, foundUsers) {
    if (err) {
      res.sendStatus(404);
      return console.error(err);
    }
    res.status(200);
    res.json(usersToLinks(foundUsers, getCurrentUrl(req)));
  });  
};

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
  console.log('modify user o/');

  const newName = xssFilters.inHTMLData(req.body.name);
  const newRole = parseInt(xssFilters.inHTMLData(req.body.role));

  if (req.body.password) {
    console.log("change user password o/");
    var password = xssFilters.inHTMLData(req.body.password);

    bcrypt.hash(password, saltRounds, function(err, hash) {  
      User.findByIdAndUpdate(
        req.params.id,
        {
          name: newName,
          password: hash,
          role: newRole,
          creditCardId: xssFilters.inHTMLData(req.body.creditCardId),
          bankAccountId: xssFilters.inHTMLData(req.body.bankAccountId),
        },
        { omitUndefined: true, new: true },
        (err, user) => {
          if (err) {
            res.sendStatus(400);
            return console.error(err);
          }
    
          res.status(200).send({
            auth: true,
            token: req.headers['token'],
            id: user._id,
            name: newName,
            role: newRole,
            creditCardId: user.creditCardId,
            bankAccountId: user.bankAccountId,
          });
        }
      );
    });
  } else {
    console.log("change user, but dont change password o/");

    User.findByIdAndUpdate(
      req.params.id,
      {
        name: newName,
        role: newRole,
        creditCardId: xssFilters.inHTMLData(req.body.creditCardId),
        bankAccountId: xssFilters.inHTMLData(req.body.bankAccountId),
      },
      { omitUndefined: true, new: true },
      (err, user) => {
        if (err) {
          res.sendStatus(400);
          return console.error(err);
        }
  
        res.status(200).send({
          auth: true,
          token: req.headers['token'],
          id: user._id,
          name: newName,
          role: newRole,
          creditCardId: user.creditCardId,
          bankAccountId: user.bankAccountId,
        });
      }
    );
  }
  /*
  console.log('modify user o/');
  console.log(req.body);
  console.log(req.params.id);
  const newName = xssFilters.inHTMLData(req.body.name);
  const newRole = parseInt(xssFilters.inHTMLData(req.body.role));

  User.findByIdAndUpdate(
    req.params.id,
    {
      name: newName,
      role: newRole,
      creditCardId: xssFilters.inHTMLData(req.body.creditCardId),
      bankAccountId: xssFilters.inHTMLData(req.body.bankAccountId),
    },
    { omitUndefined: true, new: true },
    (err, user) => {
      if (err) {
        res.sendStatus(400);
        return console.error(err);
      }

      res.status(200).send({
        auth: true,
        token: req.headers['token'],
        id: user._id,
        name: newName,
        role: newRole,
        creditCardId: user.creditCardId,
        bankAccountId: user.bankAccountId,
      });
    }
  );
  */
};

exports.create = (req, res, next) => {
  console.log('create user o/');
  var password = xssFilters.inHTMLData(req.body.password);

  bcrypt.hash(password, saltRounds, function(err, hash) {
    var newUser = new User({
      name: xssFilters.inHTMLData(req.body.name),
      role: parseInt(xssFilters.inHTMLData(req.body.role)),
      password: hash,
      creditCardId: xssFilters.inHTMLData(req.body.creditCardId),
      bankAccountId: xssFilters.inHTMLData(req.body.bankAccountId),
    });

    newUser.save(function(err) {
      if (err) {
        res.sendStatus(400);
        return console.error(err);
      }
      res.status(201);
      res.json(newUser);
    });
  });
};

exports.delete = (req, res, next) => {
  User.deleteMany((err, users) => {
    if (err) {
      res.sendStatus(404);
      return console.error(err);
    }
    if (!users) {
      res.sendStatus(404);
    } else {
      res.status(204);
      res.json();
    }
  });
};

exports.deleteOne = (req, res, next) => {
  console.log("delOne o/");
  console.log(req.params);
  
  User.findByIdAndRemove(req.params.id, (err, todo) => {
    // As always, handle any potential errors:
    if (err) return res.status(500).send(err);
    // We'll create a simple object to send back with a message and the id of the document that was removed
    // You can really do this however you want, though.
    const response = {
        message: "Todo successfully deleted",
        id: todo._id
    };
    return res.status(200).send(response);
  });
  /*
  User.findByIdAndDelete(req.params.id, function(err, user) {
    if (err) {
      console.log("user delete error 1");
      res.sendStatus(404);
      return console.error(err);
    }
    if (!user) {
      console.log("user delete error 2");
      res.sendStatus(404);
    } else {
      console.log("user delete OK");
      return res.status(204).json({ auth: false, token: null });
    }
  });
  */
};

exports.login = (req, res, next) => {
  console.log('login user o/');
  User.findOne({ name: req.body.name }, function(err, user) {
    if (err) return res.status(500).send({ auth: false, token: null });
    if (!user) return res.status(404).send({ auth: false, token: null });

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(200).send({
      auth: true,
      token,
      id: user._id,
      name: user.name,
      role: user.role,

      creditCardId: user.creditCardId,
      bankAccountId: user.bankAccountId,
    });
  });
};

exports.logout = (req, res, next) => {
  res.status(200).send({ auth: false, token: null });
};

exports.listItems = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (!user) {
      return res.status(404).json({ message: 'No user found!' });
    }
    const isOwner =
      req.userId === req.params.id || req.userRole === UserRole.ADMIN;
    Item.find({ ownerId: req.params.id }, (err, items) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!items || items.length === 0) {
        return res.status(404).json({ message: 'No items found!' });
      }
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      let newItems = items;
      if (!isOwner) {
        newItems = items.filter((item) => item.onSale === true);
      }
      const result = exportItemsToLinks(newItems, currentURL);
      return res.json(result);
    });
  });
};
