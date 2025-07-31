const Base = require("./Base");

class Calendars extends Base {
  constructor(config) {
    super(config);
  }

  /** @type {import("../models/calendars")} */
  get model() {
    return global.models.calendars;
  }

  propfind(req, res) {
    try {
      const resultXml = this.model.propfind(req.body);
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
      res.json({"message": message});
    }
  };
}

module.exports = Calendars;
