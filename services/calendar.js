const name = "calendar";
const receiverModule = "calendar"
const Connector = require("./bus_connector");

class Calendar extends Connector {
  constructor(config) {
    super(config, name, receiverModule);
  }

  async getCalendar(session, id) {
    const data = {
      calendar_id: id,
    };
    // TODO: sync token
    const func = "get-calendar";
    return this.sendRequest(session, func, data);
  }

  async listState(session, id) {
    const data = {
      calendar_id: id,
    };
    const func = "list-state";
    return this.sendRequest(session, func, data);
  }

  async listCalendars(session) {
    const data = {
      container: "Resource",
    };
    // TODO: sync token
    const func = "list-calendar";
    let cals = await this.sendRequest(session, func, data);
    console.log(cals);
    const ret = [];
    for (const c of cals) {
      const states = await this.listState(session, c.calendar_id);
      // {
      //   "id": "resource_1618825725204",
      //   "resource_id": "1618825725204",
      //   "permission": true,
      //   "name": "บรื้นๆ",
      //   "color": "#FAD1A0"
      // }
      console.log("state:", states);
      for (const s of states) {
        ret.push({
          calendar_id: `${c.calendar_id}@${s.id}`,
          name: s.name,
          color: s.color,
        });
      };
    };
    return ret;
  }

  async getEvent(session, id) {
    const data = {
      id,
    };
    const func = "get-event";
    return this.sendRequest(session, func, data);
  }

  async listEvents(session, id, state, data) {
    // TODO: handle recurrence events
    data.calendar_id = id;
    data.state_id = state;
    const func = "list-event";
    return this.sendRequest(session, func, data);
  }
}

module.exports = Calendar;
