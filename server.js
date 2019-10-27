const express = require("express");
const router = require('./router');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', router);

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

module.exports = app;