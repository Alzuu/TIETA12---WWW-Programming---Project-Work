const xssFilters = require('xss-filters');
const Item = require('../models/Item');
const UserRole = require('../models/UserRole');
const BankAccount = require('../models/BankAccount');
const User = require('../models/User');

module.exports = {
  /* List all items
   */
  listAll(req, res) {
    // Check for admin role
    if (req.userRole === UserRole.ADMIN) {
      // Find all items
      Item.find((err, items) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (items.length === 0) {
          return res.status(404).json({ message: 'No item found!' });
        }
        return res.json(items);
      });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  },
  /* List all customers' items on sale
   */
  listCustomersItems(req, res) {
    // Check for shopkeeper/admin role
    if (
      req.userRole === UserRole.ADMIN ||
      req.userRole === UserRole.SHOPKEEPER
    ) {
      // Find all items where owner is customer and item is for sale
      Item.find({ ownerIsCustomer: true, onSale: true }, (err, items) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (items.length === 0) {
          return res.status(404).json({ message: 'No item found!' });
        }
        return res.json(items);
      });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  },
  /* List all shopkeepers' items on sale
   */
  listShopkeepersItems(req, res) {
    Item.find({ ownerIsCustomer: false, onSale: true }, (err, items) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (items.length === 0) {
        return res.status(404).json({ message: 'No item found!' });
      }
      return res.json(items);
    });
  },
  /* Add new item
   */
  add(req, res) {
    const newItem = new Item({
      name: xssFilters.inHTMLData(req.body.name),
      price: parseFloat(xssFilters.inHTMLData(req.body.price)),
      ownerId: xssFilters.inHTMLData(req.body.ownerId),
      ownerIsCustomer: xssFilters.inHTMLData(req.body.ownerIsCustomer),
      onSale: xssFilters.inHTMLData(req.body.onSale),
      pictureId: xssFilters.inHTMLData(
        req.body.pictureId ? req.body.pictureId : ''
      ),
    });
    newItem.save((err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      return res.json(item);
    });
  },
  /* Get one item
   */
  getOne(req, res) {
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      if (item.onSale && item.ownerIsCustomer) {
        // Check for shopkeeper/admin role
        if (
          req.userRole === UserRole.ADMIN ||
          req.userRole === UserRole.SHOPKEEPER
        ) {
          return res.json(item);
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (item.onSale && !item.ownerIsCustomer) {
        return res.json(item);
      }
      if (!item.onSale) {
        if (req.userRole === UserRole.ADMIN || req.userId === item.ownerId) {
          return res.json(item);
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
  },
  updateOne(req, res) {
    // Get updated data
    const {
      name,
      price,
      ownerId,
      ownerIsCustomer,
      onSale,
      pictureId,
    } = req.body;
    // Find item
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      // Check if user is item owner or admin
      if (req.userId === item.ownerId || req.userRole === UserRole.ADMIN) {
        const newData = {
          name,
          price,
          ownerId,
          ownerIsCustomer,
          onSale,
          pictureId,
        };
        item.updateOne(newData, (error, raw) => {
          if (error) {
            return res.status(400).json({ message: error });
          }
          return res.json(raw);
        });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    });
  },
  deleteOne(req, res) {
    // Find item
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      // Check if user is item owner or admin
      if (req.userId === item.ownerId || req.userRole === UserRole.ADMIN) {
        item.remove((error, ditem) => {
          if (err) {
            return res.status(400).json({ message: err });
          }
          return res.json(ditem);
        });
      }
      return res.status(401).json({ message: 'Unauthorized' });
    });
  },
  sellOne(req, res) {
    // Find item
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      // Check if item is on sale
      if (item.onSale) {
        // Check that userid in parameter same as in request or user is admin
        if (
          req.params.userId === req.userId ||
          req.userRole === UserRole.ADMIN
        ) {
          /* Check user rights: if item owner is customer, user has to be admin or shopkeeper
           * If owner is shopkeeper, user can be anything
           */
          if (item.ownerIsCustomer) {
            if (
              req.userRole === UserRole.ADMIN ||
              req.userRole === UserRole.SHOPKEEPER
            ) {
              item.updateOne(
                {
                  ownerIsCustomer: req.userRole === UserRole.ADMIN,
                  onSale: false,
                  ownerId: req.params.userId,
                },
                (error, raw) => {
                  if (error) {
                    return res.status(400).json({ message: error });
                  }
                  const { bankAccountId } = User.findById(item.ownerId);
                  BankAccount.findByIdAndUpdate(bankAccountId, {
                    $inc: { balance: item.price },
                  });
                  return res.json(raw);
                }
              );
            }
            return res.status(401).json({ message: 'Unauthorized' });
          }
          // If item owner is shopkeeper
          item.updateOne(
            {
              ownerIsCustomer: !req.userRole === UserRole.SHOPKEEPER,
              onSale: false,
              ownerId: req.params.userId,
            },
            (error, raw) => {
              if (error) {
                return res.status(400).json({ message: error });
              }
              const { bankAccountId } = User.findById(item.ownerId);
              BankAccount.findByIdAndUpdate(bankAccountId, {
                $inc: { balance: item.price },
              });
              return res.json(raw);
            }
          );
        }
      }
      // If item is not on sale, check for admin role
      if (req.userRole === UserRole.ADMIN) {
        const { userRole } = User.findById(req.params.userid);
        item.updateOne(
          {
            ownerIsCustomer: !userRole === UserRole.SHOPKEEPER,
            onSale: false,
            ownerId: req.params.userId,
          },
          (error, raw) => {
            if (error) {
              return res.status(400).json({ message: error });
            }
            const { bankAccountId } = User.findById(item.ownerId);
            BankAccount.findByIdAndUpdate(bankAccountId, {
              $inc: { balance: item.price },
            });
            return res.json(raw);
          }
        );
      }
      return res.status(401).json({ message: 'Unauthorized' });
    });
  },
};
