const { getXMLHead } = require("../utils/xml");
const Base = require("./base");

class Events extends Base {
  constructor(config) {
    super(config);
  }

  /**@type {import("../services/calendar")} */
  get calendarService() {
    return global.services.calendar;
  }

  async get(session, eventId) {
    console.log("get event");
    const icsId = this.parseHrefToIcsId(eventId);
    const event = await this.calendarService.getEvent(session, icsId);
    // const event = {
    //   id: "EVENT1",
    //   name: "event_1",
    //   start: 1753951657000,
    //   end: 1753951659000,
    //   isAllDay: false,
    //   creator: user,
    // };
    const ics = await this.toIcs(event);
    const etag = this.eTag(event);
    return {
      content: ics,
      etag,
    };
  }

  delete(session, eventId) {
    console.log("delete event");
    const icsId = this.parseHrefToIcsId(eventId);
    return this.calendarService.deleteEvent(session, icsId);
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
