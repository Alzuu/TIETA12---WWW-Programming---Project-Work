const mongoose = require('mongoose');
// eslint-disable-next-line
let db;

function connect(dbConfig) {
  return mongoose
    .connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(
      () => {
        db = mongoose.connection;
      },
      (err) => {
        throw err;
      }
    );
}
function disconnect() {
  mongoose.disconnect();
  process.exit(0);
}
module.exports = { connect, disconnect };
