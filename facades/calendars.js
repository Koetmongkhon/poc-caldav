class Calendars {
  constructor(config) {
    this.config = config;
  }

  /**@type {import ("../models/calendars")} */
  get model() {
    return global.models.calendars;
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

  propfind(body) {
    if (!this._isPropfind(body))
      throw new Error("invalid body")
    const isAll = this._isAllProp(body);
    return this.model.propfind(body, isAll);
  }

  report(calId, xmlDoc) {
    console.log("request report");
    const rootNode = xmlDoc.root();
    const name = rootNode.name();
    switch (name) {
      case "sync-collection":
        console.log("sync-collection");
        throw new Error("unimplemented");
        // handleReportSyncCollection(comm, cl);

      case "calendar-multiget":
        console.log("calendar-multiget");
        throw new Error("unimplemented");
        // handleReportCalendarMultiget(comm, cl);

      case "calendar-query":
        console.log("calendar-query");
        return this.model.calendarQuery(calId, xmlDoc);

      default:
        if (name != "text") console.log("P-R: not handled: " + name);
          throw new Error("invalid report request");
    };
  }
}

module.exports = Calendars;
