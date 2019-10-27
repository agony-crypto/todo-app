const mongodb = require("mongodb");
const connectionString = 'mongodb+srv://todoAppUser:P@ssw0rd@cluster0-nwzyt.mongodb.net/TodoApp?retryWrites=true&w=majority';

let port = process.env.PORT;
if (port === null || port === "" || port === undefined) {
  port = 3000;
}

mongodb.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
  module.exports = client.db();
  const app = require('./server')
  app.listen(port, () => console.log(`Listening on port ${port}`));
});