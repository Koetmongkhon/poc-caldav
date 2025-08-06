const name = "resource";
const receiverModule = 'resource-management'
const Connector = require("./bus_connector");

class ResourceManagement extends Connector {
  constructor(config) {
    super(config, name, receiverModule);
  }

  createReservation(session, body) {
    const func = "create-reservation";
    return this.sendRequest(session, func, body);
  }
}

module.exports = ResourceManagement;
