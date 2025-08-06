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

  /**@type {import("../services/resource_management")} */
  get rmService() {
    return global.services.resource_management;
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

  async createEvent(ctx, body) {
    console.log("create event");
    const { session } = ctx;
    if (!body.attendees || body.attendees.length == 0)
      body.attendees = [
        {
          "id": session.id,
          "name": null,
          "email": null,
          "role": null,
          "rsvp": null,
          "joinState": 0,
          "isOrganizer": true,
          "comment": null
        }
      ]
    if (!ctx.state)
      throw new Error("invalid calendar id format: {RESOURCE}@{STATE}");
    const stateFormat = ctx.state.split("_");
    const resource = stateFormat[0];
    stateFormat.shift();
    const stateId = stateFormat.join("_");
    switch (resource) {
      case "resource":
        body.id = stateId;
        console.log(body);
        return this.rmService.createReservation(session, body);
      default:
        throw new Error(`not support ${resource} resource`);
    }
  }

  async put(ctx, body) {
    console.log("put event");
    console.log("Raw body:", body);
    body = this.icsToEvent(body);
    console.log("ics from body:", body);
    const icsId = this.parseHrefToIcsId(ctx.eventId);
    // TODO: parse ics body;
    // TODO: get event;
    // TODO: put event;
    try {
      const target = await this.calendarService.getEvent(ctx.session, icsId);
      throw new Error("not implemented");
    } catch (err) {
      if (err.code == 10002 || err.message.includes("Data not found")) {
        return this.createEvent(ctx, body);
      }
      console.log(err);
    }
    return;
  }
}

module.exports = Events;
