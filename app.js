const express = require("express");
const xmlparser = require("express-xml-bodyparser");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(xmlparser());

global.models = require("./models");
global.facades = require("./facades");
global.handlers = require("./handlers");

const routers = require("./router");

app.use((req, res, next) => {
  console.log(`receive ${req.method} ${req.path}`);
  req.absPath = req.path;
  next();
});
app.propfind("/.well-known/caldav", (req, res) => {
  console.log("PROBFIND well know");
  res.redirect(304, "/caldav/p");
});
app.use(routers);

app.listen(9898, () => console.log("server listening at :9898"));
