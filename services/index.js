const fs = require("fs");

const filenames = fs.readdirSync(__dirname);
const config = require("../config.json");

const services = {};
filenames.forEach((name) => {
  if (name == "index.js" || name == "bus_connector.js" || !name.endsWith(".js")) return;
  const className = name.slice(0, -3);
  const Class = require(`./${className}`);
  services[className.toLowerCase()] = new Class(config);
});

module.exports = services;
