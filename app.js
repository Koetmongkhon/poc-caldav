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

app.use("/api", routers);

app.listen(9898, () => console.log("server listening at :9898"));
