const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const xssFilters = require('xss-filters');
const config = require('../config.js');
const Item = require('../models/Item');
const UserRole = require('../models/UserRole');
const { exportItemsToLinks } = require('./itemController');
const User = require('../models/User');

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

const getCurrentUrl = (req) =>
  `${req.protocol}://${req.get('host')}${req.originalUrl}`; // eslint-disable-line

const userIsAdmin = (req) => req.userRole === UserRole.ADMIN;

const usersToLinks = (users, currentURL) => {
  const result = [];
  users.forEach((user) => {
    const userJson = JSON.parse(JSON.stringify(user));
    userJson.links = userToLinks(user, currentURL);
    result.push(userJson);
  });
  return result;
};

exports.list = (req, res) => {
  if (!userIsAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  User.find((err, foundUsers) => {
    if (err) {
      return res.sendStatus(404);
    } else {
      res.status(200);
      return res.json(usersToLinks(foundUsers, getCurrentUrl(req)));
    }
  });
};

exports.one = (req, res) => {
  if (req.userId === req.params.id || userIsAdmin(req)) {
    User.findById(req.params.id, (err, foundUser) => {
      if (err) {
        return res.sendStatus(404);
      }
      res.status(200);
      res.json(foundUser);
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.modify = (req, res) => {
  if (req.userId === req.params.id || userIsAdmin(req)) {
    const newName = xssFilters.inHTMLData(req.body.name);
    const newRole = parseInt(xssFilters.inHTMLData(req.body.role), 10);
    if (req.body.password) {
      const password = xssFilters.inHTMLData(req.body.password);
      bcrypt.hash(password, saltRounds, (err, hash) => {
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
          (error, user) => {
            if (err) {
              return res.sendStatus(400);
            }
            res.status(200).send({
              auth: true,
              token: req.headers.token,
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
            return res.sendStatus(400);
          }

          res.status(200).send({
            auth: true,
            token: req.headers.token,
            id: user._id,
            name: newName,
            role: newRole,
            creditCardId: user.creditCardId,
            bankAccountId: user.bankAccountId,
          });
        }
      );
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.create = (req, res) => {
  const password = xssFilters.inHTMLData(req.body.password);
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const newUser = new User({
      name: xssFilters.inHTMLData(req.body.name),
      role: parseInt(xssFilters.inHTMLData(req.body.role), 10),
      password: hash,
      creditCardId: xssFilters.inHTMLData(req.body.creditCardId),
      bankAccountId: xssFilters.inHTMLData(req.body.bankAccountId),
    });
    newUser.save((error) => {
      if (error) {
        return res.sendStatus(400);
      }
      res.status(201);
      res.json(newUser);
    });
  });
};

exports.delete = (req, res) => {
  if (userIsAdmin(req)) {
    User.deleteMany((err, users) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (!users) {
        res.sendStatus(404);
      } else {
        res.status(204);
        res.json();
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.deleteOne = (req, res) => {
  if (req.userId === req.params.id || userIsAdmin(req)) {
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: 'User successfully deleted',
        id: user._id,
      };
      return res.status(200).send(response);
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.login = (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) return res.status(500).send({ auth: false, token: null });
    if (!user) return res.status(404).send({ auth: false, token: null });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user._id }, config.secret, {
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

exports.logout = (req, res) => {
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
    Item.find({ ownerId: req.params.id }, (error, items) => {
      if (err) {
        return res.status(400).json({ message: error });
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
