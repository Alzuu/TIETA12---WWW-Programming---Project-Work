/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable space-before-function-paren */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('../../server/app');
const UserRole = require('../../server/models/UserRole');

const { describe } = mocha;
const { before } = mocha;
const { after } = mocha;
const { it } = mocha;
const { beforeEach } = mocha;
const { expect } = chai;
chai.use(chaiHttp);

// API urls
const listShopkeepersItemsUrl = '/api/items/shopkeepers/';
const listCustomersItemsUrl = '/api/items/customers/';
const registerUrl = '/api/users/';
const loginUrl = '/api/users/login/';
const itemUrl = '/api/items/';

// Tests
describe('/api/items', () => {
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
  let adminToken;
  let shopkeeperToken;
  let customerToken;
  let shopkeeperId;
  let customerId;
  let adminId;

  before((done) => {
    request = chai.request.agent(app);

    done();
  });
  after((done) => {
    request.close();
    mongoose.disconnect(done);
  });
  describe('GET /api/items', () => {
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
              // Add item for customer
              request
                .post(itemUrl)
                .set('token', customerToken)
                .type('json')
                .send({
                  name: 'Kaljaa',
                  price: 20.0,
                  ownerId: customerId,
                  ownerIsCustomer: false,
                  onSale: true,
                });
            });
        });
      return request
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
              // Add item for shopkeeper
              request
                .post(itemUrl)
                .set('token', shopkeeperToken)
                .type('json')
                .send({
                  name: 'Sipsipussi',
                  price: 0.99,
                  ownerId: shopkeeperId,
                  ownerIsCustomer: false,
                  onSale: true,
                });
            });
        });
    });
    it('should require admin rights to list all items', () => {
      request
        .get(itemUrl)
        .set('token', customerToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
        });
    });
    it('should list all items with admin rights', () => {
      request
        .get(itemUrl)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
        });
    });
  });
  describe('GET /api/items/shopkeepers', () => {
    it("should list shopkeepers' items without registering", () => {
      request.get(listShopkeepersItemsUrl).end((err, res) => {
        expect(res.statusCode).to.equal(200);
      });
    });
  });
  describe('GET /api/items/customers', () => {
    it("should require admin/shopkeeper rights to list customers' items", () => {
      request
        .get(listCustomersItemsUrl)
        .set('token', customerToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
        });
    });
    it("should list customers' items with admin rights", () => {
      request
        .get(listCustomersItemsUrl)
        .set('token', shopkeeperToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
        });
    });
    it("should list customers' items with shopkeeper rights", () => {
      request
        .get(listCustomersItemsUrl)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
        });
    });
  });
  describe('POST /api/items', () => {
    let payload;
    beforeEach(() => {
      payload = {
        name: 'Nakkipaketti',
        price: 1.99,
        ownerId: shopkeeperId,
        ownerIsCustomer: false,
        onSale: true,
      };
    });
    it('should require logging in to add new item', () => {
      request
        .post(itemUrl)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(403);
        });
    });
    it('should require item name', () => {
      delete payload.name;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item name not be empty string', () => {
      payload.name = '';
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item price', () => {
      delete payload.price;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item price to be greater than zero', () => {
      payload.price = -1;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item price to be a number', () => {
      payload.price = 'kolmesataa';
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item ownerId', () => {
      delete payload.ownerId;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(401);
        });
    });
    it('should require item ownerId to be userId or admin rights', () => {
      payload.ownerId = customerId;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(401);
        });
      request
        .post(itemUrl)
        .set('token', adminToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(200);
        });
    });
    it('should require item ownerIsCustomer', () => {
      delete payload.ownerIsCustomer;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item ownerIsCustomer to be true or false', () => {
      payload.ownerIsCustomer = 'joo';
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item onSale', () => {
      delete payload.onSale;
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('should require item onSale to be true or false', () => {
      payload.onSale = 'ei';
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.statusCode).to.equal(400);
        });
    });
    it('pictureId should be empty string if no picture', () => {
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          expect(res.body.pictureId).to.equal('');
        });
    });
    it('pictureId should be non-empty string if given picture', () => {
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('form')
        .field('name', payload.name)
        .field('price', payload.price)
        .field('ownerId', payload.ownerId)
        .field('ownerIsCustomer', payload.ownerIsCustomer)
        .field('onSale', payload.onSale)
        .attach('image', fs.readFileSync('test/server/testi.png'), 'testi.png')
        .then((res) => {
          expect(res.body.pictureId).to.not.equal('');
        });
    });
  });
  describe('GET /api/items/:id', () => {
    let payload;
    before(async function(done) {
      payload = {
        name: 'Nakkipaketti',
        price: 1.99,
        ownerId: customerId,
        ownerIsCustomer: true,
        onSale: true,
      };
      done();
    });

    it("should require admin/shopkeeper rights to show customers' item on sale", () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .get(itemUrl + res.body._id)
            .set('token', customerToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
              request
                .get(itemUrl + res.body._id)
                .set('token', adminToken)
                .then((respons) => {
                  expect(respons.statusCode).to.equal(200);
                });
              request
                .get(itemUrl + res.body._id)
                .set('token', shopkeeperToken)
                .then((respons) => {
                  expect(respons.statusCode).to.equal(200);
                });
            });
        });
    });
    it('should require admin rights or owning the item to show item not on sale', () => {
      payload.onSale = false;
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .get(itemUrl + res.body._id)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            })
            .then(() => {
              request
                .get(itemUrl + res.body._id)
                .set('token', adminToken)
                .then((respons) => {
                  expect(respons.statusCode).to.equal(200);
                });
            });
        });
    });
  });
  describe('PUT /api/items/:id', () => {
    let payload;
    before(async function(done) {
      payload = {
        name: 'Nakkipaketti',
        price: 1.99,
        ownerId: customerId,
        ownerIsCustomer: true,
        onSale: true,
      };
      done();
    });
    it('should require item ownerId to be userId or admin rights', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', shopkeeperToken)
            .send({ name: 'NAKKI' })
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            });
          request
            .put(itemUrl + res.body._id)
            .set('token', adminToken)
            .send({ name: 'NAKKI' })
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({ name: 'NAKKI' })
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
        });
    });
    it('should require item name not be empty string', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({ name: '' })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
    it('should require item price to be greater than zero', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({
              price: -1,
            })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
    it('should require item price to be a number', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({
              price: 'peruna',
            })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
    it('should require item ownerId to be non-empty string', () => {
      request
        .post(itemUrl)
        .set('token', shopkeeperToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({
              ownerId: '',
            })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
    it('should require item ownerIsCustomer to be true or false', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({
              ownerIsCustomer: 'porkkana',
            })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
    it('should require item onSale to be true or false', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(itemUrl + res.body._id)
            .set('token', customerToken)
            .send({
              onSale: 'lanttu',
            })
            .then((response) => {
              expect(response.statusCode).to.equal(400);
            });
        });
    });
  });
  describe('DELETE /api/items/:id', () => {
    let payload;
    before(async function(done) {
      payload = {
        name: 'Nakkipaketti',
        price: 1.99,
        ownerId: customerId,
        ownerIsCustomer: true,
        onSale: true,
      };
      done();
    });
    it('should require item ownerId to be userId or admin rights', () => {
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .delete(itemUrl + res.body._id)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            });
          request
            .delete(itemUrl + res.body._id)
            .set('token', customerToken)
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
        });
      request
        .post(itemUrl)
        .set('token', customerToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .delete(itemUrl + res.body._id)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            });
          request
            .delete(itemUrl + res.body._id)
            .set('token', adminToken)
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
        });
    });
  });
  describe('PUT /api/items/:id/sell/:userid', () => {
    let payload;
    before(async function(done) {
      payload = {
        name: 'Nakkipaketti',
        price: 1.99,
        ownerId: customerId,
        ownerIsCustomer: true,
        onSale: true,
      };
      done();
    });
    it('should require :userid to be userId or admin rights', () => {
      request
        .post(itemUrl)
        .set('token', adminToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(`${itemUrl}${res.body._id}/sell/${shopkeeperId}`)
            .set('token', customerToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            });
          request
            .put(`${itemUrl}${res.body._id}/sell/${shopkeeperId}`)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
          request
            .put(`${itemUrl}${res.body._id}/sell/${customerId}`)
            .set('token', adminToken)
            .then((response) => {
              expect(response.statusCode).to.equal(200);
            });
        });
    });
    it('should require item to be on sale', () => {
      payload.onSale = false;
      request
        .post(itemUrl)
        .set('token', adminToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(`${itemUrl}${res.body._id}/sell/${shopkeeperId}`)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(401);
            });
        });
    });
    it("should change item's ownerId to :userid", () => {
      payload.onSale = true;
      request
        .post(itemUrl)
        .set('token', adminToken)
        .type('json')
        .send(payload)
        .then((res) => {
          request
            .put(`${itemUrl}${res.body._id}/sell/${shopkeeperId}`)
            .set('token', shopkeeperToken)
            .then((response) => {
              expect(response.statusCode).to.equal(200);
              expect(response.body.ownerId).to.equal(shopkeeperId);
            });
        });
    });
  });
});
