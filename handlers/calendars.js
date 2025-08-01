const Base = require("./Base");

class Calendars extends Base {
  constructor(config) {
    super(config);
  }

  /** @type {import("../facades/calendars")} */
  get facade() {
    return global.facades.calendars;
  }

  propfind(req, res) {
    try {
      const resultXml = this.facade.propfind(req.body);
      this.responseXml(res, 207, resultXml);
    } catch (err) {
      console.log(err);
      let code = 500;
      let message = "internal server";
      if (err.message == "invalid body") {
        code = 400;
        message = err.message;
      }
      res.status(code);
      res.json({ "message": message });
    }
  };

  options(req, res) {
    res.set
    res.set("Allow", "OPTIONS, GET, POST, PUT, DELETE, PROPFIND, PROPPATCH, REPORT");
    res.set("DAV", "1, 2, access-control, calendar-access")
    res.status(200);
    res.end();
  }

  report(req, res) {
    try {
      const { calId } = req.params;
      const resultXml = this.facade.report(calId, req.body);
      this.responseXml(res, 207, resultXml);
    } catch (err) {
      console.log(err);
      let code = 500;
      let message = "internal server";
      if (err.message.includes("invalid")) {
        code = 400;
        message = err.message;
      }
      res.status(code);
      res.json({ "message": message });
    }
  }

  get(req, res) {
    const { calId, eventId } = req.params;
    const user = "USERNAME";
    try {
      const result = this.facade.get(user, calId, eventId);
      res.set("Content-Type", "text/calendar");
      res.set("ETag", result.etag);
      res.send(result.content);
    } catch (err) {
      console.log(err);
      let code = 500;
      let message = "internal server";
      if (err.message.includes("invalid")) {
        code = 400;
        message = err.message;
      }
      res.status(code);
      res.json({ "message": message });
    }
  }
}

module.exports = Calendars;
