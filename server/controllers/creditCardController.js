/* eslint-disable no-underscore-dangle */
const CreditCard = require('../models/CreditCard');

module.exports = {
  /**
   * Returns list of credit cards
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async listCreditCards(req, res) {
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
  },

  /**
   * Returns a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */

  async showCreditCard(req, res) {
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
  },

  /**
   * Adds a new credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async addCreditCard(req, res) {
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
        number,
        CVC,
        ownerName,
      });

      const newCard = await card.save();
      await res.status(201).json(newCard);
      console.log('New credit card added.');
    } catch (err) {
      res.json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Removes a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async removeCreditCard(req, res) {
    try {
      const ID = req.params.cardId;
      const deletedCard = await CreditCard.deleteOne({ _id: `${ID}` });
      res.status(200).json(deletedCard);
      console.log('Successfully removed credit card.');
    } catch (err) {
      res.status(400).json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Updates a specific credit card
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async updateCreditCard(req, res) {
    try {
      const ID = req.params.cardId;
      const { number, CVC, ownerName } = req.body;
      const updatedCard = await CreditCard.findOne({ _id: `${ID}` });
      updatedCard.number = number;
      updatedCard.CVC = CVC;
      updatedCard.ownerName = ownerName;
      await updatedCard.save();
      res.status(200).json(updatedCard);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
};
