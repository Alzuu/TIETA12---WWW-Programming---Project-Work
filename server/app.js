const express = require('express');

const app = express();
let port;
if (process.env.NODE_ENV === 'dev') {
  port = 3001;
} else {
  port = 3000;
}
app.use(express.static('client/build'));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
