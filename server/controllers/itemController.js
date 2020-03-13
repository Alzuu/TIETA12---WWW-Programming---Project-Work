const xssFilters = require('xss-filters');
const Item = require('../models/Item');
const UserRole = require('../models/UserRole');
const BankAccount = require('../models/BankAccount');
const User = require('../models/User');

function itemToLinks(item, currentURL) {
  const result = [
    {
      rel: 'self',
      method: 'GET',
      href: `${currentURL}/${item._id}`,
      types: ['application/json'],
    },
    {
      rel: 'self',
      method: 'DELETE',
      href: `${currentURL}/${item._id}`,
      types: ['application/json'],
    },
    {
      rel: 'self',
      method: 'PUT',
      href: `${currentURL}/${item._id}`,
      types: ['application/json'],
    },
    {
      rel: 'self',
      method: 'PUT',
      href: `${currentURL}/${item._id}/sell/:userid`,
      types: ['application/json'],
    },
  ];
  return result;
}
function itemsToLinks(items, currentURL) {
  const result = [];
  items.forEach((item) => {
    const arrayItem = JSON.parse(JSON.stringify(item));
    arrayItem.links = itemToLinks(item, currentURL);
    result.push(arrayItem);
  });
  return result;
}
function delItemFromUser(itemid, userid) {
  User.findByIdAndUpdate(userid, { $pull: { items: itemid } }, () => {});
}
function addItemToUser(itemid, userid) {
  User.findByIdAndUpdate(userid, { $push: { items: itemid } }, () => {});
}
module.exports = {
   exportItemsToLinks(items, currentURL) {
      return itemsToLinks(items,currentURL);
   },
  /* List all items
   */
  listAll(req, res) {
    // Check for admin role
    if (req.userRole === UserRole.ADMIN) {
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      // Find all items
      Item.find((err, items) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (items.length === 0) {
          return res.status(404).json({ message: 'No item found!' });
        }
        const result = itemsToLinks(items, currentURL);
        return res.json(result);
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },
  /* List all customers' items on sale
   */
  listCustomersItems(req, res) {
    // Check for shopkeeper/admin role
    if (
      req.userRole === UserRole.ADMIN ||
      req.userRole === UserRole.SHOPKEEPER
    ) {
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      // Find all items where owner is customer and item is for sale
      Item.find({ ownerIsCustomer: true, onSale: true }, (err, items) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (items.length === 0) {
          return res.status(404).json({ message: 'No item found!' });
        }
        const result = itemsToLinks(items, currentURL);
        return res.json(result);
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },
  /* List all shopkeepers' items on sale
   */
  listShopkeepersItems(req, res) {
    const currentURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    Item.find({ ownerIsCustomer: false, onSale: true }, (err, items) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (items.length === 0) {
        return res.status(404).json({ message: 'No item found!' });
      }
      const result = itemsToLinks(items, currentURL);
      return res.json(result);
    });
  },
  /* Add new item
   */
  add(req, res) {
    if (req.userId === req.body.ownerId || req.userRole === UserRole.ADMIN) {
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      const newItem = new Item({
        name: xssFilters.inHTMLData(req.body.name ? req.body.name : ''),
        price: parseFloat(xssFilters.inHTMLData(req.body.price)),
        ownerId: xssFilters.inHTMLData(
          req.body.ownerId ? req.body.ownerId : ''
        ),
        ownerIsCustomer: xssFilters.inHTMLData(req.body.ownerIsCustomer),
        onSale: xssFilters.inHTMLData(req.body.onSale),
        pictureId: xssFilters.inHTMLData(req.file ? req.file.filename : ''),
      });
      newItem.save((err, item) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (!item) {
          return res.status(404).json({ message: 'No item found!' });
        }
        const result = JSON.parse(JSON.stringify(item));
        result.links = itemToLinks(item, currentURL);
        addItemToUser(item._id, item.ownerId);
        return res.json(result);
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },
  /* Get one item
   */
  getOne(req, res) {
    const currentURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
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
          const result = JSON.parse(JSON.stringify(item));
          result.links = itemToLinks(item, currentURL);
          return res.json(result);
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (item.onSale && !item.ownerIsCustomer) {
        const result = JSON.parse(JSON.stringify(item));
        result.links = itemToLinks(item, currentURL);
        return res.json(result);
      }
      if (!item.onSale) {
        if (req.userRole === UserRole.ADMIN || req.userId === item.ownerId) {
          const result = JSON.parse(JSON.stringify(item));
          result.links = itemToLinks(item, currentURL);
          return res.json(result);
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
  },
  updateOne(req, res) {
    const currentURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
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
        item.updateOne(
          newData,
          { omitUndefined: true, runValidators: true },
          (error, raw) => {
            if (error || raw.ok === 0) {
              return res.status(400).json({ message: error });
            }
            Item.findById(req.params.id, (er, doc) => {
              const result = doc;
              result.links = itemToLinks(doc, currentURL);
              delItemFromUser(doc._id, item.ownerId);
              addItemToUser(doc._id, doc.ownerId);
              return res.json(result);
            });
          }
        );
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
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
          if (error) {
            return res.status(400).json({ message: err });
          }
          delItemFromUser(item._id, item.ownerId);
          return res.json(ditem);
        });
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
  },
  sellOne(req, res) {
    const currentURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    // Find item
    Item.findById(req.params.id, (err, item) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      if (!item) {
        return res.status(404).json({ message: 'No item found!' });
      }
      // Check that item owner isn't trying to buy own item
      if (item.ownerId !== req.params.userId) {
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
                    ownerId: req.params.userid,
                  },
                  (error, raw) => {
                    if (error || raw.ok === 0) {
                      return res.status(400).json({ message: error });
                    }
                    const { bankAccountId } = User.findById(item.ownerId);
                    BankAccount.findByIdAndUpdate(bankAccountId, {
                      $inc: { balance: item.price },
                    });
                    Item.findById(req.params.id, (er, doc) => {
                      const result = doc;
                      result.links = itemToLinks(doc, currentURL);
                      delItemFromUser(item._id, item.ownerId);
                      addItemToUser(item._id, doc.ownerId);
                      return res.json(result);
                    });
                  }
                );
              } else {
                return res.status(401).json({ message: 'Unauthorized' });
              }
            } else {
              // If item owner is shopkeeper
              item.updateOne(
                {
                  ownerIsCustomer: !req.userRole === UserRole.SHOPKEEPER,
                  onSale: false,
                  ownerId: req.params.userid,
                },
                { omitUndefined: true },
                (error, raw) => {
                  if (error || raw.ok === 0) {
                    return res.status(400).json({ message: error });
                  }
                  const { bankAccountId } = User.findById(item.ownerId);
                  BankAccount.findByIdAndUpdate(bankAccountId, {
                    $inc: { balance: item.price },
                  });
                  Item.findById(req.params.id, (er, doc) => {
                    const result = doc;
                    result.links = itemToLinks(doc, currentURL);
                    delItemFromUser(item._id, item.ownerId);
                    addItemToUser(item._id, doc.ownerId);
                    return res.json(result);
                  });
                }
              );
            }
          }
        } else if (req.userRole === UserRole.ADMIN) {
          // If item is not on sale, check for admin role

          const { userRole } = User.findById(req.params.userid);
          item.updateOne(
            {
              ownerIsCustomer: !userRole === UserRole.SHOPKEEPER,
              onSale: false,
              ownerId: req.params.userid,
            },
            { omitUndefined: true },
            (error, raw) => {
              console.log(raw);
              if (error) {
                return res.status(400).json({ message: error });
              }
              const { bankAccountId } = User.findById(item.ownerId);
              BankAccount.findByIdAndUpdate(bankAccountId, {
                $inc: { balance: item.price },
              });
              Item.findById(req.params.id, (er, doc) => {
                const result = doc;
                result.links = itemToLinks(doc, currentURL);
                delItemFromUser(item._id, item.ownerId);
                addItemToUser(item._id, doc.ownerId);
                return res.json(result);
              });
            }
          );
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      }
    });
  },
};
