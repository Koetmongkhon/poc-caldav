class Calendars {
  constructor(config) {
    this.config = config;
  }

  /** @type {import("../models/calendars")} */
  get model() {
    return global.models.calendars;
  }

  propfind(req, res) {
    try {
      const resultXml = this.model.propfind(req.body);
      res.set('Content-Type', 'text/xml');
      res.status(207);
      res.send(resultXml).end();
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
