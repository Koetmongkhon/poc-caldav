/* eslint-disable global-require */
const fs = require("fs");

const config = require("../config");

const names = fs.readdirSync(__dirname);

const models = {};
names.forEach((name) => {
  if (!name.endsWith(".js") || name === "base.js" || name === "index.js") return;
  const className = name.slice(0, -3);
  const Class = require(`./${className}`);
  models[className.toLowerCase()] = new Class(config);
});

module.exports = models;
