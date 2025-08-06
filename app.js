const express = require("express");
const xmlparser = require("express-xml-bodyparser");
const app = express();
const config = require("./config.json");

const RMQ = require("redismq");
const channelManagerAddress = `${config.bus.channelManager.host}:${config.bus.channelManager.port}`;
const mqApp = new RMQ(channelManagerAddress, config.bus.module, config.bus.module);
mqApp.regisAndListen(config.bus.channel);
global.rmq = mqApp;

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(xmlparser());
app.use(express.text({ type: 'text/*' }));

global.services = require("./services");
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
