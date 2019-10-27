const express = require("express");
const mongodb = require("mongodb");
const sanitizeHTML = require("sanitize-html");
const db = require('./db').collection('items');

const app = express();
// const connectionString = 'mongodb+srv://todoAppUser:P@ssw0rd@cluster0-nwzyt.mongodb.net/TodoApp?retryWrites=true&w=majority';
// let port = process.env.PORT;
// if (port === null || port === "" || port === undefined) {
//   port = 3000;
// }

// let db;

// mongodb.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
//   db = client.db();
//   app.listen(port, () => console.log(`Listening on port ${port}`));
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
  console.log(req.headers.authorization);
  if (req.headers.authorization === "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next()
  } else {
    res.status(401).send("Authentication Required");
  }
}

app.use(passwordProtected);

app.get('/', (req, res) => {
  db.find().toArray((err, items) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
          
        </ul>
        
      </div>
      <script>
        const items = ${JSON.stringify(items)};
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>
  `);
  });
});

app.post('/create-item', (req, res) => {
  const userInput = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: [] });
  if (userInput) {
    db.insertOne({ text: userInput }, (err, info) => { res.json(info.ops[0]); });
  }
});

app.post('/update-item', (req, res) => {
  const userInput = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: [] });
  db.findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, { $set: { text: userInput } }, () => {
    res.send("Success!!");
  });
});

app.post('/delete-item', (req, res) => {
  db.deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, () => {
    res.send("Success!!");
  });
});

module.exports = app;