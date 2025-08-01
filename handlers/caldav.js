const Base = require("./Base");

class Caldav extends Base {
  constructor(config) {
    super(config);
  }

  /** @type {import("../facades/caldav")} */
  get facade() {
    return global.facades.caldav;
  }

  propfind(req, res) {
    try {
      const ctx = this.newContext(req);
      const resultXml = this.facade.propfind(ctx, req.body);
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
      const ctx = this.newContext(req);
      const resultXml = this.facade.report(ctx, req.body);
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

  delete(req, res) {
    const { calId, eventId } = req.params;
    const user = "USERNAME";
    try {
      this.facade.delete(user, calId, eventId);
      res.end();
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

module.exports = Caldav;
