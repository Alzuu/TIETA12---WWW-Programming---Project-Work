# Initial project plan document

## Course project group information

Group name: I want all the 3 points!

Group GitLab repo URL: https://course-gitlab.tuni.fi/tieta12-2019-2020/i-want-all-the-3-points

Group members:

- Kari Harmaahieta, 430837, kari.harmaahieta@tuni.fi
- Peter Skogberg, 97676, peter.skogberg@tuni.fi
- Allan Li, 431949, allan.li@tuni.fi

## Planned functionality

1. Api

- Models
  - Item
  - User
  - CreditCard
  - BankAccount
- DB
- Express App
  - Static React App
  - API Routes
    - Item
    - User
    - CreditCard
    - BankAccount
  - Controllers
    - Item
    - User
    - CreditCard
    - BankAccount

2. React app

- Homepage
- User related pages
- Item related pages

3. Testing

- API testing

## Pages and navigation

- Homepage
- User login
- User registration
- User information
- User bankaccount
- User creditcard
- User unregister
- Item selling - user and shopkeeper
- Item listing - for customer
- Item listing - per shopkeeper
- Item listing - all
- Item listing - for shopkeepers
- Item page
- Shopping card
- Payment page

## Modules your group created in your Node project

```
.
├── package.json                        --> app info and dependencies
├── client                              --> React application
├── plan                                --> design document images
├── server                              --> Backend application
    ├── app.js                          --> express app
    ├── db.js                           --> database connection setup
    ├── controllers                     --> controllers
    │   ├── itemController.js           --> controller for items
    │   ├── userController.js           --> controller for users
    │   ├── creditCardController.js     --> controller for users' credit cards
    │   └── bankAccountController.js    --> controller for users' bank accounts
    ├── models                          --> models (Mongoose schemas etc.)
    │   ├── itemModel.js                --> model for items
    │   ├── userModel.js                --> model for users
    │   ├── creditCardModel.js          --> model for users' credit cards
    │   └── bankAccountModel.js         --> model for users' bank accounts
    └── routes                          --> API routes
        ├── itemsRoute.js               --> route for items
        ├── usersRoute.js               --> route for users
        ├── creditCardsRoute.js         --> route for users' credit cards
        └── bankAccountsRoute.js        --> route for users' bank accounts
```

## Mongo database and Mongoose schemas

### Item

Attributes (type)

- name (String)
- price (Number)
- ownerId (String)
- ownerIsCustomer (Boolean)
- pictureId (String)

Purpose

- Used for listing, selling and buying items

Connections

- ownerId has item owners id

### User

Attributes (type)

- name (String)
- role (Enum ['admin','shopkeeper','customer'])
- password (String)
- items (Array(String))
- creditCardId (String)
- bankAccountId (String)

Purpose

- Used for registering users and enabling them different roles

Connections

- items-array has each users itemIds listed, creditCardId has users credit cards id

### CreditCard

Attributes (type)

- number (Number)
- CVC (Number)
- ownerName (String)

Purpose

- Used for buying items

Connections

- User-model has creditCardId as attribute

### BankAccount

Attributes (type)

- number (Number)
- balance (Number)

Purpose

- User gets money here for selling items

Connections

- User-model has bankAccountId as attribute

## API

Here are all API routes. Payload still to be designed.

| Http Method | Route                   | Payload |                             Description |
| ----------- | ----------------------- | ------- | --------------------------------------: |
| GET         | /users                  | -       |                           Get all users |
| POST        | /users                  | payload |                       Register new user |
| GET         | /users/:id              | -       |                       Get user with :id |
| PUT         | /users/:id              | payload |                    Update user with :id |
| DELETE      | /users/:id              | -       |                    Delete user with :id |
| GET         | /users/:id/items        | -       |         Get users listed items with :id |
| POST        | /users/login            | payload |                                   Login |
| POST        | /users/logout           | -       |                                  Logout |
| GET         | /items                  | -       |                           Get all items |
| POST        | /items                  | payload |                            Add new item |
| GET         | /items/:id              | -       |                       Get item with :id |
| PUT         | /items/:id              | payload |                    Update item with :id |
| DELETE      | /items/:id              | -       |                    Delete item with :id |
| PUT         | /items/:id/sell/:userid | -       | Sell item with :id to user with :userid |
| GET         | /bankaccounts           | -       |                   Get all bank accounts |
| POST        | /bankaccounts           | payload |                    Add new bank account |
| GET         | /bankaccounts/:id       | -       |               Get bank account with :id |
| PUT         | /bankaccounts/:id       | payload |            Update bank account with :id |
| DELETE      | /bankaccounts/:id       | -       |            Delete bank account with :id |
| GET         | /creditcards            | -       |                    Get all credit cards |
| POST        | /creditcards            | payload |                     Add new credit card |
| GET         | /creditcards/:id        | -       |                Get credit card with :id |
| PUT         | /creditcards/:id        | payload |             Update credit card with :id |
| DELETE      | /creditcards/:id        | -       |             Delete credit card with :id |

## React and Redux

We're going to plan a React-Redux single-page application as our frontend.

## Testing

We're going to test at least the API with Mocha/chaihttp.

## Project timetable and division of work

Deadline: 20.3

Division of work with deadlines (initial, will update):

Allan

- [ ] Pages and navigation (pictures) 3.3

Peter

- [ ] Users and login

Kari

- [ ] Documentation 20.3
- [x] Project template 3.3
- [ ] Express application
- [ ] API Routes
