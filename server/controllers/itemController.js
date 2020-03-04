const xssFilters = require('xss-filters');
const Item = require('../models/Item');

module.exports = {
  /* List all items
   */
  listAll(req, res) {
    // Check for admin role
    Item.find((err, items) => {
      if (items.length === 0 || err) {
        res.status(404);
        return res.end();
      }
      return res.json(items);
    });
  },
  /* List all customers' items on sale
   */
  listCustomersItems(req, res) {
    // Check for shopkeeper/admin role
    Item.find({ ownerIsCustomer: true, onSale: true }, (err, items) => {
      if (items.length === 0 || err) {
        res.status(404);
        return res.end();
      }
      return res.json(items);
    });
  },
  /* List all shopkeepers' items on sale
   */
  listShopkeepersItems(req, res) {
    // Check for shopkeeper/admin role
    Item.find({ ownerIsCustomer: false, onSale: true }, (err, items) => {
      if (items.length === 0 || err) {
        res.status(404);
        return res.end();
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
    newItem.save((err, doc) => {
      if (err) {
        res.status(400);
        return res.end();
      }
      return res.json(doc);
    });
  },
  /* Get one item
   */
  getOne(req, res) {
    Item.findById(req.params.id, (err, item) => {
      if (!item || err) {
        res.status(404);
        return res.end();
      }
      if (item.onSale && item.ownerIsCustomer) {
        return res.json(item);
      }
      if (item.onSale && !item.ownerIsCustomer) {
        // Check role
      }
    });
  },
};
