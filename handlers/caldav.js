const Base = require("./Base");

class Caldav extends Base {
  constructor(config) {
    super(config);
  }

  /** @type {import("../facades/caldav")} */
  get facade() {
    return global.facades.caldav;
  }

  async propfind(req, res) {
    try {
      const ctx = this.newContext(req);
      const resultXml = await this.facade.propfind(ctx, req.body);
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

  proppatch(req, res) {
    try {
      const ctx = this.newContext(req);
      const resultXml = this.facade.proppatch(ctx, req.body);
      this.responseXml(res, 200, resultXml);
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
  }

  options(req, res) {
    res.set
    res.set("Allow", "OPTIONS, GET, POST, PUT, DELETE, PROPFIND, PROPPATCH, REPORT");
    res.set("DAV", "1, 2, access-control, calendar-access")
    res.status(200);
    res.end();
  }

  async report(req, res) {
    try {
      const ctx = this.newContext(req);
      const resultXml = await this.facade.report(ctx, req.body);
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

  async get(req, res) {
    try {
      const ctx = this.newContext(req);
      const result = await this.facade.get(ctx.session, ctx.eventId);
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

  async delete(req, res) {
    try {
      const ctx = this.newContext(req);
      await this.facade.delete(ctx.session, ctx.state, ctx.eventId);
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

  async put(req, res) {
    try {
      const ctx = this.newContext(req);
      console.log("Raw:", req.rawBody);
      console.log("Body:", req.body);
      await this.facade.put(ctx, req.body);
      res.status(201).end();
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
