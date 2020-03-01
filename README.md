**_Welcome to the home of your group's TIETA12, part 2 coursework code and documentation!_**

This README.md file is where your group writes your project plan/project report.

When you write it, you must use Markdown. [Documentation for GitLab Flavored Markdown (GFM)](https://docs.gitlab.com/ee/user/markdown.html).

The directory structure of the code is up to your group to decide, but this README.md file must remain in place.

# Initial project plan document

The headers that must be present in this document are shown here.

For instructions on what to add under these headers, see the course project assignment document, [see the coursework assignment document](https://docs.google.com/document/d/1ctG6mURrs1WlqwwPnMOFE_mSIEhZVCjp2XGefAZMdxQ/edit#heading=h.vsanic5plbto)

## Course project group information

Kari Harmaahieta, 430837, kari.harmaahieta@tuni.fi
Peter Skogberg, 97676, peter.skogberg@tuni.fi
Allan Li, 431949, allan.li@tuni.fi
Group name: I want all the 3 points!
GitLab repo URL: https://course-gitlab.tuni.fi/tieta12-2019-2020/i-want-all-the-3-points

## Planned functionality

1. API
   1.1 Models
   1.1.1 Item
   1.1.2 User
   1.1.3 CreditCard
   1.1.4 BankAccount
   1.2 DB
   1.3 Express app
   1.3.1 Routes
   1.3.2 Controllers
2. React app
3. Testing

## Pages and navigation

Homepage
User login
User registration
User information
User bankaccount
User creditcard
User unregister
Item selling - user and shopkeeper
Item listing - for customer
Item listing - per shopkeeper
Item listing - all
Item listing - for shopkeepers
Item page
Shopping cart
Payment page

## Modules your group created in your Node project

client

- React frontend here
  plan
- images for the initial plan here
  server
- controllers
  -- itemController.js
  -- userController.js
  -- creditCardController.js
  -- bankAccountController.js
- models
  -- itemModel.js
  -- userModel.js
  -- creditCardModel.js
  -- bankAccountModel.js
- routes
  -- indexRoute.js
  -- itemsRoute.js
  -- usersRoute.js
  -- bankAccountsRoute.js
  -- creditCardsRoute.js
- app.js
- db.js
  package.json

## Mongo database and Mongoose schemas

Model: Item
Attributes: name:String, price:Number, ownerId:String, ownerIsCustomer:Boolean, pictureId:String?
Purpose: Used for listing, selling and buying items
Connections: ownerId has item owners id

Model: User
Attributes: name:String, role:Enum(admin,shopkeeper,customer), password:String, items:Array(itemId:String), creditCardId:String, bankAccountId:String
Purpose: Used for registering users and enabling them different roles
Connections: items-array has each users itemIds listed, creditCardId has users creditcards id

Model: CreditCard
Attributes: number:Number, CVC:Number, ownerName:String
Purpose: Used for buying items
Connections: User-model has creditCardId as attribute

Model: BankAccount
Attributes: number:Number, balance:Number
Purpose: User gets money here for selling items
Connections: User-model has bankAccountId as attribute

## API

GET /users
POST /users
GET /users/:id
PUT /users/:id
DELETE /users/:id
GET /users/:id/items
POST /users/login
POST /users/logout

GET /items
POST /items
GET /items/:id
PUT /items/:id
DELETE /items/:id
PUT /items/:id/sell/:userid

GET /bankaccounts
POST /bankaccounts
GET /bankaccounts/:id
PUT /bankaccounts/:id
DELETE /bankaccounts/:id

GET /creditcards
POST /creditcards
GET /creditcards/:id
PUT /creditcards/:id
DELETE /creditcards/:id

## React and Redux

## Testing

We are going to test at least the API with Mocha/chaihttp

## Project timetable and division of work

Deadline: 20.3
Division of work:
Allan - pages and navigation 3.3
Peter - users and login
Kari - documentation, project template 3.3

_Good luck and happy WWWdevvin’!_
