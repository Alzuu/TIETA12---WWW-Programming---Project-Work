/* eslint-disable no-underscore-dangle */
const BankAccount = require('../models/BankAccount');

module.exports = {
  /**
   * Returns list of bank accounts
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async listBankAccounts(req, res) {
    try {
      const accounts = await BankAccount.find();
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      const accountsWithLinks = [];
      accounts.forEach((account) => {
        const currentAccount = JSON.parse(JSON.stringify(account));
        // Add HATEOAS links to bank account
        currentAccount.links = [
          {
            rel: 'self',
            method: 'GET',
            href: `${currentURL}/${currentAccount._id}`,
            types: ['application/json'],
          },
          {
            rel: 'self',
            method: 'DELETE',
            href: `${currentURL}/${currentAccount._id}`,
            types: [],
          },
          {
            rel: 'self',
            method: 'PUT',
            href: `${currentURL}/${currentAccount._id}`,
            types: ['application/json'],
          },
        ];
        accountsWithLinks.push(currentAccount);
      });
      res.status(200).json(accountsWithLinks);
    } catch (err) {
      res.status(404).json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Returns a specific bank account
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */

  async showBankAccount(req, res) {
    try {
      const currentURL = `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }`;
      let account = await BankAccount.findById(req.params.bankAccountId).exec();
      account = JSON.parse(JSON.stringify(account));

      // Add HATEOAS links to bank account
      account.links = [
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
      res.status(200).json(account);
    } catch (err) {
      res.status(404).json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Adds a new bank account
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async addBankAccount(req, res) {
    try {
      const { number, balance } = req.body;
      let account = await BankAccount.findOne({ number }).exec();

      if (account) {
        const errorMessage = 'Bank account already registered in DB!';

        if (!req.is('json')) {
          res.status(400).json({ message: errorMessage });
        }
      }

      account = new BankAccount({
        number,
        balance,
      });

      const newAccount = await account.save();
      await res.status(201).json(newAccount);
      console.log('New bank account added.');
    } catch (err) {
      res.json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Removes a specific bank account
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async removeBankAccount(req, res) {
    try {
      const ID = req.params.bankAccountId;
      const deletedAccount = await BankAccount.deleteOne({ _id: `${ID}` });
      res.status(200).json(deletedAccount);
      console.log('Successfully removed bank account.');
    } catch (err) {
      res.status(400).json({ message: err });
      console.log('Caught an error: ', err);
    }
  },

  /**
   * Updates a specific bank account
   * @param {Object} req is express request object
   * @param {Object} res is express response object
   */
  async updateBankAccount(req, res) {
    try {
      const ID = req.params.bankAccountId;
      const { number, balance } = req.body;
      const updatedAccount = await BankAccount.findOne({ _id: `${ID}` });
      updatedAccount.number = number;
      updatedAccount.balance = balance;
      await updatedAccount.save();
      res.status(200).json(updatedAccount);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
};
