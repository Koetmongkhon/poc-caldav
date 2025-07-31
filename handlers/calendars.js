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
}

module.exports = Calendars;
