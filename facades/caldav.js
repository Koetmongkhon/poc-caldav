class Caldav {
  constructor(config) {
    this.config = config;
  }

  /**@type {import ("../models/calendars")} */
  get model() {
    return global.models.calendars;
  }

  /**@type {import ("../models/events");} */
  get eventModel() {
    return global.models.events;
  }

  _isPropfind(xmlDoc) {
    const node = xmlDoc.get("/A:propfind", {
      A: "DAV:",
      B: "urn:ietf:params:xml:ns:carddav",
      C: "http://calendarserver.org/ns/",
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    if (node && Object.keys(node).length != 0) {
      return true;
    }

    return false
  }

  _isAllProp(xmlDoc) {
    const temp = xmlDoc.get("/A:propfind/A:allprop", {
      A: "DAV:",
      B: "urn:ietf:params:xml:ns:caldav",
      C: "http://calendarserver.org/ns/",
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    if (temp) {
      console.log("all prop");
      return true;
    }
    return false;
  }

  propfind(ctx, body) {
    if (!this._isPropfind(body))
      throw new Error("invalid body")
    const isAll = this._isAllProp(body);
    return this.model.propfind(ctx, body, isAll);
  }

  report(ctx, xmlDoc) {
    console.log("request report");
    const rootNode = xmlDoc.root();
    const name = rootNode.name();
    switch (name) {
      case "sync-collection":
        // handleReportSyncCollection(comm, cl);
        console.log("sync-collection");
        throw new Error("unimplemented");

      case "calendar-multiget":
        console.log("calendar-multiget");
        return this.model.calendarMultiget(ctx, xmlDoc);

      case "calendar-query":
        console.log("calendar-query");
        return this.model.calendarQuery(ctx, xmlDoc);

      default:
        if (name != "text") console.log("P-R: not handled: " + name);
        throw new Error("invalid report request");
    };
  }

  get(user, calId, eventId) {
    return this.eventModel.get(user, calId, eventId);
  }

  delete(user, calId, eventId) {
    if (eventId) {
      return this.eventModel.delete(user, calId, eventId);
    }
    return this.model.delete(user, calId);
  }
}

module.exports = Caldav;
