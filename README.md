# Final project document

## Instructions

Before you start, make sure you have [Vagrant](https://www.vagrantup.com/) and [Git](https://git-scm.com/) installed. This project uses a different Vagrantfile than the one used earlier on the course, as it didn't have enough memory for the production build, so we changed the memory to 2 GiBs. Make sure that you don't have any other Vagrant machines running than this.

1. Clone this repository: `git clone https://course-gitlab.tuni.fi/tieta12-2019-2020/i-want-all-the-3-points.git`
2. Go to repository folder and start virtual machine: `vagrant up`
3. Log into the virtual machine: `vagrant ssh`
4. Go to project folder: `cd /vagrant_data`
5. Start the application: `npm start` to start in production mode, `npm run dev` to start in development mode
6. Open your browser and head to [localhost](http://localhost:3000).

There are three users made for testing purposes:

| Username   | Password   | Role       |
| ---------- | ---------- | ---------- |
| admin      | admin      | admin      |
| shopkeeper | shopkeeper | shopkeeper |
| customer   | customer   | customer   |

Log into each one of these and try out the functionalities. Admin can do pretty much anything but buy items or have credit cards and bank accounts of their own. If an admin wants to buy or sell items, they have to make a customer account.

Before you can sell or buy items, you have to add a credit card and a bank account to your account.

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

![Pages and navigation - Anonymous](/plan/pages_and_navigation/anonymous.jpg)
![Pages and navigation - Anonymous](/plan/pages_and_navigation/customer.jpg)
![Pages and navigation - Anonymous](/plan/pages_and_navigation/shopkeeper.jpg)

## Modules your group created in your Node project

```
.

├── client                                --> React frontend
│   ├── public                            --> public files for React
│   │   └── itemimages                    --> folder for uploading item images
│   │       └── nologo.png                --> placeholder image
│   ├── src                               --> source code for React
│   │   ├── actions                       --> Redux actions
│   │   │   ├── bankAccounts.js           --> bank accounts actions
│   │   │   ├── creditCards.js            --> credit cards actions
│   │   │   ├── darkMode.js               --> dark mode actions
│   │   │   ├── items.js                  --> items actions
│   │   │   └── usersActions.js           --> users actions
│   │   ├── components                    --> React components
│   │   │   ├── AddItemPage.js            --> add item
│   │   │   ├── AllItemsPage.js           --> show all items
│   │   │   ├── BankAccount.js            --> edit bank account
│   │   │   ├── BankAccountAdmin.js       --> edit bank account (admin)
│   │   │   ├── bankaccounts.css          --> styles for bank accounts
│   │   │   ├── BuyItemPage.js            --> show item information
│   │   │   ├── ConfirmBuyPage.js         --> confirm purchase of item
│   │   │   ├── CreditCard.js             --> edit credit card
│   │   │   ├── CreditCardAdmin.js        --> edit credit card (admin)
│   │   │   ├── creditcards.css           --> styles for credit cards
│   │   │   ├── CustomerItemsPage.js      --> show customer items
│   │   │   ├── DeleteItemPage.js         --> delete item
│   │   │   ├── EditItemPage.js           --> edit item
│   │   │   ├── ItemList.js               --> component to list items
│   │   │   ├── ItemPage.css              --> styles for item page
│   │   │   ├── ItemPage.js               --> show shopkeeper items
│   │   │   ├── items.css                 --> styles for items
│   │   │   ├── Layout.js                 --> page layout
│   │   │   ├── ListBankAccountsPage.js   --> list all bank accounts (admin)
│   │   │   ├── ListCreditCardsPage.js    --> list all credit cards (admin)
│   │   │   ├── LoginPage.js              --> log in user
│   │   │   ├── LogoutPage.js             --> log out user
│   │   │   ├── Navigation.js             --> Material UI navigation bar
│   │   │   ├── RegistrationPage.js       --> register new user
│   │   │   ├── TextInputFormik.js        --> validate user forms
│   │   │   ├── UserItemsPage.js          --> list user's items
│   │   │   ├── UserPage.js               --> edit user information
│   │   │   ├── UserPageForAdmin.js       --> edit user information (admin)
│   │   │   ├── UserPageForCustomer.js    --> edit user information (customer)
│   │   │   ├── UserPageForShopkeeper.js  --> edit user information (shopkeeper)
│   │   │   └── UserRole.js               --> user roles
│   │   ├── reducers                    --> Redux reducers
│   │   │   ├── bankAccounts.js         --> bank accounts reducer
│   │   │   ├── creditCards.js          --> credit cards reducer
│   │   │   ├── darkMode.js             --> dark mode reducer
│   │   │   ├── index.js                --> combining all reducers
│   │   │   ├── items.js                --> items reducer
│   │   │   └── usersReducer.js         --> users reducer
│   │   ├── store                       --> Redux store
│   │   │   └── configureStore.js       --> configure Redux store
│   │   ├── App.css                     --> styles for app
│   │   ├── App.js                      --> App entry point
│   │   ├── index.css                   --> styles for index
│   │   ├── index.js                    --> start React
│   │   └── serviceWorker.js            --> React service workers
│   ├── .gitignore                      --> ignore list for git
│   ├── package.json                    --> React app info and dependencies
│   └── README.md                       --> React app readme
├── plan                                --> design document images
├── server                              --> Express backend
│   ├── app.js                          --> Express app
│   ├── db.js                           --> database connection setup
│   ├── controllers                     --> controllers
│   │   ├── itemController.js           --> controller for items
│   │   ├── userController.js           --> controller for users
│   │   ├── creditCardController.js     --> controller for users' credit cards
│   │   └── bankAccountController.js    --> controller for users' bank accounts
│   ├── models                          --> models (Mongoose schemas etc.)
│   │   ├── itemModel.js                --> model for items
│   │   ├── userModel.js                --> model for users
│   │   ├── creditCardModel.js          --> model for users' credit cards
│   │   └── bankAccountModel.js         --> model for users' bank accounts
│   └── routes                          --> API routes
│       ├── itemsRoute.js               --> route for items
│       ├── usersRoute.js               --> route for users
│       ├── creditCardsRoute.js         --> route for users' credit cards
│       └── bankAccountsRoute.js        --> route for users' bank accounts
├── .eslintrc.json                      --> Eslint configuration
├── .gitignore                          --> ignore list for git
├── .prettierrc.json                    --> Prettier configuration
├── LICENSE                             --> Project licensing
├── package.json                        --> app info and dependencies
├── provision.sh                        --> Vagrant provision file
├── README.md                           --> project documentation
├── Vagrantfile                         --> modified Vagrantfile for project

```

## Mongo database and Mongoose schemas

### Item

Attributes (type)

- name (String)
- price (Number)
- ownerId (String)
- ownerIsCustomer (Boolean)
- onSale (Boolean)
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

- number (String)
- CVC (String)
- ownerName (String)

Purpose

- Used for buying items

Connections

- User-model has creditCardId as attribute

### BankAccount

Attributes (type)

- number (String)
- balance (Number)

Purpose

- User gets money here for selling items

Connections

- User-model has bankAccountId as attribute

## API

Here are all API routes. Payload still to be designed.

| Http Method | Route                       | Payload                                                                       |                             Description |
| ----------- | --------------------------- | ----------------------------------------------------------------------------- | --------------------------------------: |
| GET         | /api/users                  | -                                                                             |                           Get all users |
| POST        | /api/users                  | json: { name, role, creditCardId, bankAccountId, password }                   |                       Register new user |
| GET         | /api/users/:id              | -                                                                             |                       Get user with :id |
| PUT         | /api/users/:id              | json: { name, role, creditCardId, bankAccountId }                             |                    Update user with :id |
| DELETE      | /api/users/:id              | -                                                                             |                    Delete user with :id |
| GET         | /api/users/:id/items        | -                                                                             |         Get users listed items with :id |
| POST        | /api/users/login            | json: { name, password }                                                      |                                   Login |
| POST        | /api/users/logout           | -                                                                             |                                  Logout |
| GET         | /api/items                  | -                                                                             |                           Get all items |
| GET         | /api/items/shopkeepers      | -                                                                             |               Get all shopkeepers items |
| GET         | /api/items/customers        | -                                                                             |                     Get customers items |
| POST        | /api/items                  | formdata: name, price, ownerId, ownerIsCustomer, onSale, image(.png or .jpeg) |                            Add new item |
| GET         | /api/items/:id              | -                                                                             |                       Get item with :id |
| PUT         | /api/items/:id              | json: { name, price, ownerId, ownerIsCustomer, onSale }                       |                    Update item with :id |
| DELETE      | /api/items/:id              | -                                                                             |                    Delete item with :id |
| PUT         | /api/items/:id/sell/:userid | -                                                                             | Sell item with :id to user with :userid |
| GET         | /api/bankaccounts           | -                                                                             |                   Get all bank accounts |
| POST        | /api/bankaccounts           | json: { number, balance }                                                     |                    Add new bank account |
| GET         | /api/bankaccounts/:id       | -                                                                             |               Get bank account with :id |
| PUT         | /api/bankaccounts/:id       | json: { number, balance }                                                     |            Update bank account with :id |
| DELETE      | /api/bankaccounts/:id       | -                                                                             |            Delete bank account with :id |
| GET         | /api/creditcards            | -                                                                             |                    Get all credit cards |
| POST        | /api/creditcards            | json: { number, CVC, ownerName }                                              |                     Add new credit card |
| GET         | /api/creditcards/:id        | -                                                                             |                Get credit card with :id |
| PUT         | /api/creditcards/:id        | json: { number, CVC, ownerName }                                              |             Update credit card with :id |
| DELETE      | /api/creditcards/:id        | -                                                                             |             Delete credit card with :id |

## React and Redux

Our frontend is a React single-page-application that uses Redux to handle state. We use redux-localstorage to keep state from changing from page refreshes. Home page lists all shopkeepers' items on sale. Other things you can do is register a new account and login. When logged in, as a customer, you can also add items for sale and buy items from shopkeepers. You can also list own items and edit and/or delete them. Shopkeepers can in addition to that also buy items from customers and list them on their own page. Admins also see a listing of all items, credit cards and bank accounts that they can modify and/or delete. There is also a page to edit user information, in which you can change user information and add, edit or delete credit cards and bank accounts.

For user interface, we use [Material-UI](https://material-ui.com/). As a bonus, we also implemented dark mode toggling.

## Testing

We're going to test at least the some of the API with Mocha/chaihttp.

## Project timetable and division of work

Deadline: 23.3

Division of work with deadlines:

- [ ] Final testing (install clean repo and try with instructions, try to do stuff) 23.3
- [x] Finishing touches (CSS etc) 22.3

Allan

- [x] Bankaccount & creditcard testing 22.3
- [x] Code cleanup 22.3
- [x] BankAccount bug fixes & admin view 22.3
- [x] BankAccount React 22.3
- [x] Pages and navigation (pictures) 3.3
- [x] BankAccount API
- [x] CreditCard API

Peter

- [ ] Code cleanup 22.3
- [ ] Users API 22.3
- [ ] Users React 22.3
- [ ] Users testing 22.3

Kari

- [ ] Documentation 22.3
- [x] Code cleanup and bug fixes 22.3
- [x] Setup script 22.3
- [x] Project template 3.3
- [x] Express application
- [x] API Routes
- [x] Items API
- [x] Items testing
- [x] Items React
- [x] CreditCard React
