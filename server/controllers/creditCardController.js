/* eslint-disable no-underscore-dangle */
const xssFilters = require('xss-filters');
const CreditCard = require('../models/CreditCard');
const UserRole = require('../models/UserRole');
const User = require('../models/User');

module.exports = {
  /**
   * Returns list of credit cards
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async listCreditCards(req, res) {
    if (req.userRole === UserRole.ADMIN) {
      try {
        const cards = await CreditCard.find();
        const currentURL = `${req.protocol}://${req.get('host')}${
          req.originalUrl
        }`;
        const cardsWithLinks = [];
        cards.forEach((card) => {
          const currentCard = JSON.parse(JSON.stringify(card));
          // Add HATEOAS links to credit card
          currentCard.links = [
            {
              rel: 'self',
              method: 'GET',
              href: `${currentURL}/${currentCard._id}`,
              types: ['application/json'],
            },
            {
              rel: 'self',
              method: 'DELETE',
              href: `${currentURL}/${currentCard._id}`,
              types: [],
            },
            {
              rel: 'self',
              method: 'PUT',
              href: `${currentURL}/${currentCard._id}`,
              types: ['application/json'],
            },
          ];
          cardsWithLinks.push(currentCard);
        });
        res.status(200).json(cardsWithLinks);
      } catch (err) {
        res.status(404).json({ message: err });
        console.log('Caught an error: ', err);
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },

  /**
   * Returns a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */

  async showCreditCard(req, res) {
    if (req.userRole) {
      User.findById(req.userId, async (uerr, doc) => {
        if (uerr) {
          res.status(400).json({ message: uerr });
        } else {
          // Check if creditCardId matches or user is admin
          if (
            doc.creditCardId === req.params.cardId ||
            req.userRole === UserRole.ADMIN
          ) {
            try {
              const currentURL = `${req.protocol}://${req.get('host')}${
                req.originalUrl
              }`;
              let card = await CreditCard.findById(req.params.cardId).exec();
              card = JSON.parse(JSON.stringify(card));

              // Add HATEOAS links to credit card
              card.links = [
                {
                  rel: 'self',
                  method: 'GET',
                  href: currentURL,
                  types: ['application/json'],
                },
                {
                  rel: 'self',
                  method: 'DELETE',
                  href: currentURL,
                  types: [],
                },
                {
                  rel: 'self',
                  method: 'PUT',
                  href: currentURL,
                  types: ['application/json'],
                },
              ];
              res.status(200).json(card);
            } catch (err) {
              res.status(404).json({ message: err });
              console.log('Caught an error: ', err);
            }
          } else {
            res.status(403).json({ message: 'Forbidden' });
          }
        }
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },

  /**
   * Adds a new credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async addCreditCard(req, res) {
    if (req.userRole) {
      User.findById(req.userId, async (uerr, doc) => {
        if (uerr) {
          res.status(400).json({ message: uerr });
        } else {
          try {
            const { number, CVC, ownerName } = req.body;
            let card = await CreditCard.findOne({ number }).exec();

            if (card) {
              const errorMessage = 'Card already registered in DB!';

              if (!req.is('json')) {
                res.status(400).json({ message: errorMessage });
              }
            }

            card = new CreditCard({
              number: xssFilters.inHTMLData(number),
              CVC: xssFilters.inHTMLData(CVC),
              ownerName: xssFilters.inHTMLData(ownerName),
            });

            const newCard = await card.save();
            await User.findByIdAndUpdate(
              { _id: doc._id },
              { creditCardId: newCard._id }
            );
            await res.status(200).json(newCard);
            console.log('New credit card added.');
          } catch (err) {
            res.json({ message: err });
            console.log('Caught an error: ', err);
          }
        }
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },

  /**
   * Removes a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async removeCreditCard(req, res) {
    if (req.userRole) {
      User.findById(req.userId, async (uerr, doc) => {
        if (uerr) {
          res.status(400).json({ message: uerr });
        } else {
          // Check if creditCardId matches or user is admin
          if (
            doc.creditCardId === req.params.cardId ||
            req.userRole === UserRole.ADMIN
          ) {
            try {
              const ID = req.params.cardId;
              const deletedCard = await CreditCard.deleteOne({ _id: `${ID}` });
              await User.findByIdAndUpdate(
                { _id: doc._id },
                { bankAccountId: 'undefined' }
              );
              res.status(200).json(deletedCard);
              console.log('Successfully removed credit card.');
            } catch (err) {
              res.status(400).json({ message: err });
              console.log('Caught an error: ', err);
            }
          } else {
            res.status(403).json({ message: 'Forbidden' });
          }
        }
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },

  /**
   * Updates a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async updateCreditCard(req, res) {
    if (req.userRole) {
      User.findById(req.userId, async (uerr, doc) => {
        if (uerr) {
          res.status(400).json({ message: uerr });
        } else {
          // Check if creditCardId matches or user is admin
          if (
            doc.creditCardId === req.params.cardId ||
            req.userRole === UserRole.ADMIN
          ) {
            try {
              const ID = req.params.cardId;
              const { number, CVC, ownerName } = req.body;
              const updatedCard = await CreditCard.findOne({ _id: `${ID}` });
              updatedCard.number = xssFilters.inHTMLData(number);
              updatedCard.CVC = xssFilters.inHTMLData(CVC);
              updatedCard.ownerName = xssFilters.inHTMLData(ownerName);
              await updatedCard.save();
              res.status(200).json(updatedCard);
            } catch (err) {
              res.status(400).json({ message: err });
            }
          } else {
            res.status(403).json({ message: 'Forbidden' });
          }
        }
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
};
