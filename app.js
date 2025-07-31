const express = require("express");
const xmlparser = require('express-xml-bodyparser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(xmlparser());

global.models = require("./models");
global.handlers = require("./handlers");

const calendarRouter = require("./calendar_routes");
app.use("/api/v1/calendar", calendarRouter);

app.listen(9898, () => console.log("server listening at :9898"));
