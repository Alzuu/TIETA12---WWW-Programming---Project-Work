/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require('../../server/app');
const UserRole = require('../../server/models/UserRole');

const { describe } = mocha;
const { before } = mocha;
const { beforeEach } = mocha;
const { after } = mocha;
const { it } = mocha;
const { expect } = chai;
chai.use(chaiHttp);

// API URLs
const creditCardUrl = '/api/creditcards';
const registerUrl = '/api/users';
const loginUrl = '/api/users/login';

// Tests
describe(creditCardUrl, () => {
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
  const adminCreditCard = {
    number: `a${Date.now()}`,
    CVC: 123,
    ownerName: 'admin',
  };
  const shopkeeperCreditCard = {
    number: `sk${Date.now()}`,
    CVC: 123,
    ownerName: 'shopkeeper',
  };
  const customerCreditCard = {
    number: `c${Date.now()}`,
    CVC: 123,
    ownerName: 'customer',
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
  after(() => {
    request.close();
  });

  describe('GET /api/creditcards', async () => {
    before(async () => {
      // Add users for each roles
      await request
        .post(registerUrl)
        .type('json')
        .send(newAdmin)
        .then(async (res) => {
          // Get JWT token
          await request
            .post(loginUrl)
            .type('json')
            .send(newAdmin)
            .then(async (response) => {
              adminToken = response.body.token;
              adminId = res.body._id;
              // Add credit card to admin
              await request
                .post(creditCardUrl)
                .type('json')
                .set('token', adminToken)
                .send(adminCreditCard)
                .then(async (cardresponse) => {
                  const creditCardId = cardresponse.body._id;
                  newAdmin.creditCardId = creditCardId;

                  await request
                    .put(`${registerUrl}/${adminId}`)
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
        .then(async (res) => {
          // Get JWT token
          await request
            .post(loginUrl)
            .type('json')
            .send(newShopkeeper)
            .then(async (response) => {
              shopkeeperToken = response.body.token;
              shopkeeperId = res.body._id;
              // Add credit card to shopkeeper
              await request
                .post(creditCardUrl)
                .type('json')
                .set('token', shopkeeperToken)
                .send(shopkeeperCreditCard)
                .then(async (cardresponse) => {
                  const creditCardId = cardresponse.body._id;
                  newShopkeeper.creditCardId = creditCardId;

                  await request
                    .put(`${registerUrl}/${shopkeeperId}`)
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
        .then(async (res) => {
          // Get JWT token
          await request
            .post(loginUrl)
            .type('json')
            .send(newCustomer)
            .then(async (response) => {
              customerToken = response.body.token;
              customerId = res.body._id;
              // Add credit card to customer
              await request
                .post(creditCardUrl)
                .type('json')
                .set('token', customerToken)
                .send(customerCreditCard)
                .then(async (cardresponse) => {
                  const creditCardId = cardresponse.body._id;
                  newCustomer.creditCardId = creditCardId;

                  await request
                    .put(`${registerUrl}/${customerId}`)
                    .set('token', customerToken)
                    .type('json')
                    .send(newCustomer)
                    .then(() => {});
                });
            });
        });
    });
    it('should require admin rights to list all credit cards', async () => {
      await request
        .get(creditCardUrl)
        .set('token', shopkeeperToken)
        .then((res) => expect(res.statusCode).to.equal(401));
    });
    it('should list all credit cards with admin rights', async () => {
      await request
        .get(creditCardUrl)
        .set('token', adminToken)
        .then((res) => expect(res.statusCode).to.equal(200));
    });
  });
  describe('POST /api/creditcards', async () => {
    let payload;
    beforeEach(() => {
      payload = {
        number: '1234567890',
        CVC: '123',
        ownerName: 'owner',
      };
    });
    it('should require logging in to add a credit card', async () => {
      await request
        .post(creditCardUrl)
        .type('json')
        .send(payload)
        .then((res) => expect(res.statusCode).to.equal(403));
    });
  });
  describe('GET /api/creditcards/:id', async () => {
    it('should require admin rights or owning the credit card to show credit card', async () => {
      await request
        .get(`${creditCardUrl}/${newCustomer.creditCardId}`)
        .set('token', shopkeeperToken)
        .then((res) => expect(res.statusCode).to.equal(403));
      await request
        .get(`${creditCardUrl}${newCustomer.creditCardId}`)
        .set('token', adminToken)
        .then((response) => expect(response.statusCode).to.equal(200));
      await request
        .get(`${creditCardUrl}${newCustomer.creditCardId}`)
        .set('token', customerToken)
        .then((r) => expect(r.statusCode).to.equal(200));
    });
  });
  describe('PUT /api/creditcards/:id', async () => {
    it('should require admin rights or owning the credit card to update', async () => {
      await request
        .put(`${creditCardUrl}/${newCustomer.creditCardId}`)
        .set('token', shopkeeperToken)
        .send({
          number: `${Date.now()}`,
          CVC: '789',
          ownerName: 'newOwner',
        })
        .then((response) => {
          expect(response.statusCode).to.equal(403);
        });
      await request
        .put(`${creditCardUrl}/${newCustomer.creditCardId}`)
        .set('token', adminToken)
        .send({
          number: `${Date.now()}`,
          CVC: '789',
          ownerName: 'newOwner',
        })
        .then((response) => {
          expect(response.statusCode).to.equal(200);
        });
      await request
        .put(`${creditCardUrl}/${newCustomer.creditCardId}`)
        .set('token', customerToken)
        .send({
          number: `new${Date.now()}`,
          CVC: '789',
          ownerName: 'newOwner',
        })
        .then((r) => {
          expect(r.statusCode).to.equal(200);
        });
    });
  });
  describe('DELETE /api/creditcards/:id', async () => {
    it('should require admin rights or owning the credit card to delete', async () => {
      await request
        .post(creditCardUrl)
        .set('token', customerToken)
        .type('json')
        .send({ number: `new${Date.now()}`, CVC: '789', ownerName: 'newOwner' })
        .then(async (res) => {
          await request
            .delete(`${creditCardUrl}/${res.body._id}`)
            .set('token', shopkeeperToken)
            .then((response) => expect(response.statusCode).to.equal(403));
          await request
            .delete(`${creditCardUrl}/${res.body._id}`)
            .set('token', adminToken)
            .then((response) => expect(response.statusCode).to.equal(200));
        });
      await request
        .post(creditCardUrl)
        .set('token', customerToken)
        .type('json')
        .send({ number: `new${Date.now()}`, CVC: '789', ownerName: 'newOwner' })
        .then(async (res) => {
          await request
            .delete(`${creditCardUrl}/${res.body._id}`)
            .set('token', shopkeeperToken)
            .then((response) => expect(response.statusCode).to.equal(403));
          await request
            .delete(`${creditCardUrl}/${res.body._id}`)
            .set('token', customerToken)
            .then((response) => expect(response.statusCode).to.equal(200));
        });
    });
  });
});
