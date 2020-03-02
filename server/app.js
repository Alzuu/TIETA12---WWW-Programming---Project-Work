const express = require('express');
const helmet = require('helmet');
const db = require('./db');
const apiRoutes = require('./routes/apiRoutes');
const app = express();

const dbConfig = {
  host: 'localhost',
  port: '27017',
  db: 'storeapp',
};
db.connect(dbConfig);
let port;
if (process.env.NODE_ENV === 'dev') {
  port = 3001;
} else {
  port = 3000;
}
// Use helmet middleware
app.use(helmet());

// Use JSON parser
app.use(express.json());
// Serve API routes
app.use('/api', apiRoutes);

// Serve static React app
app.use(express.static('client/build'));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
