const { getXMLHead } = require("../utils/xml");
const Base = require("./base");

class Events extends Base {
  constructor(config) {
    super(config);
  }

  get(user, calId, eventId) {
    console.log("get event");
    const icsId = this.parseHrefToIcsId(eventId);
    // TODO: get event
    const event = {
      id: "EVENT1",
      name: "event_1",
      start: 1753951657000,
      end: 1753951659000,
      isAllDay: false,
      creator: user,
    };
    // TODO: parse event into ics
    return {
      content: event,
      etag: `ETAG-${icsId}`,
    };
  }

  delete(user, calId, eventId) {
    console.log("delete event");
    const icsId = this.parseHrefToIcsId(eventId);
    // TODO: delete event;
    return;
  }

  put(user, calId, eventId, body) {
    console.log("put event");
    const icsId = this.parseHrefToIcsId(eventId);
    // TODO: parse ics body;
    // TODO: get event;
    // TODO: put event;
    return;
  }
}

module.exports = Events;
