/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable space-before-function-paren */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const mongoose = require('mongoose');
const app = require('../../server/app');
const UserRole = require('../../server/models/UserRole');

const { describe } = mocha;
const { before } = mocha;
const { after } = mocha;
const { it } = mocha;
const { expect } = chai;
chai.use(chaiHttp);

// API URLs
const bankAccountUrl = '/api/bankaccounts';
const registerUrl = '/api/users/';
const loginUrl = '/api/users/login/';

// Tests
describe(bankAccountUrl, () => {
  let request;
  const newAdmin = {
    name: `admin${Date.now()}`,
    password: 'admin',
    role: UserRole.ADMIN,
  };
  const newShopkeeper = {
    name: `shopkeeper${Date.now()}`,
    password: 'shopkeeper',
    role: UserRole.SHOPKEEPER,
  };
  const newCustomer = {
    name: `customer${Date.now()}`,
    password: 'customer',
    role: UserRole.CUSTOMER,
  };
  const adminBankAccount = {
    number: `a${Date.now()}`,
    balance: 100,
  };
  const shopkeeperBankAccount = {
    number: `sk${Date.now()}`,
    balance: 100,
  };
  const customerBankAccount = {
    number: `c${Date.now()}`,
    balance: 100,
  };

  let adminToken;
  let shopkeeperToken;
  let customerToken;
  let adminId;
  let shopkeeperId;
  let customerId;

  before((done) => {
    request = chai.request.agent(app);
    done();
  });
  after((done) => {
    request.close();
    return mongoose.disconnect(done);
  });

  describe('GET /api/bankaccounts', async function() {
    before(async function() {
      // Add users for each roles
      await request
        .post(registerUrl)
        .type('json')
        .send(newAdmin)
        .then((res) => {
          // Get JWT token
          request
            .post(loginUrl)
            .type('json')
            .send(newAdmin)
            .then((response) => {
              adminToken = response.body.token;
              adminId = res.body._id;
              // Add bank account to admin
              request
                .post(bankAccountUrl)
                .type('json')
                .set('token', adminToken)
                .send(adminBankAccount)
                .then((bankresponse) => {
                  const bankAccountId = bankresponse.body._id;
                  newAdmin.bankAccountId = bankAccountId;

                  request
                    .put(`${registerUrl}${adminId}`)
                    .set('token', adminToken)
                    .type('json')
                    .send(newAdmin)
                    .then(() => {});
                });
            });
        });
      await request
        .post(registerUrl)
        .type('json')
        .send(newShopkeeper)
        .then((res) => {
          // Get JWT token
          request
            .post(loginUrl)
            .type('json')
            .send(newShopkeeper)
            .then((response) => {
              shopkeeperToken = response.body.token;
              shopkeeperId = res.body._id;

              // Add bank account for shopkeeper
              request
                .post(bankAccountUrl)
                .set('token', shopkeeperToken)
                .type('json')
                .send(shopkeeperBankAccount)
                .then((bankresponse) => {
                  const bankAccountId = bankresponse.body._id;
                  newShopkeeper.bankAccountId = bankAccountId;

                  request
                    .put(`${registerUrl}${shopkeeperId}`)
                    .set('token', shopkeeperToken)
                    .type('json')
                    .send(newShopkeeper)
                    .then(() => {});
                });
            });
        });
      await request
        .post(registerUrl)
        .type('json')
        .send(newCustomer)
        .then((res) => {
          // Get JWT token
          request
            .post(loginUrl)
            .type('json')
            .send(newCustomer)
            .then((response) => {
              customerToken = response.body.token;
              customerId = res.body._id;

              // Add bank account for customer
              request
                .post(bankAccountUrl)
                .set('token', customerToken)
                .type('json')
                .send(customerBankAccount)
                .then((bankresponse) => {
                  const bankAccountId = bankresponse.body._id;
                  newCustomer.bankAccountId = bankAccountId;

                  request
                    .put(`${registerUrl}${customerId}`)
                    .set('token', customerToken)
                    .type('json')
                    .send(newCustomer)
                    .then(() => {});
                });
            });
        });
    });

    it('should require admin rights to list all bank accounts', async function() {
      await request
        .get(bankAccountUrl)
        .set('token', shopkeeperToken)
        .then((res) => {
          expect(res.statusCode).to.equal(401);
        });
    });
    it('should list all bank accounts with admin rights', async function() {
      await request
        .get(bankAccountUrl)
        .set('token', adminToken)
        .then((res) => {
          expect(res.statusCode).to.equal(200);
        });
    });
  });
});
