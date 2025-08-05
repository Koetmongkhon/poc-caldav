const name = "calendar";
const receiverModule = "calendar"
const Connector = require("./bus_connector");

class Calendar extends Connector {
  constructor(config) {
    super(config, name, receiverModule);
  }

  async getCalendar(session, id) {
    const data = {
      id,
    };
    // TODO: sync token
    const func = "get-calendar";
    return this.sendRequest(session, func, data);
  }

  async listCalendars(session) {
    const data = {
      container: "Resource",
    };
    // TODO: sync token
    const func = "list-calendar";
    return this.sendRequest(session, func, data);
  }

  async getEvent(session, id) {
    const data = {
      id,
    };
    const func = "get-event";
    return this.sendRequest(session, func, data);
  }

  async listEvents(session) {
    const data = {};
    const func = "list-event";
    return this.sendRequest(session, func, data);
  }
}

module.exports = Calendar;
