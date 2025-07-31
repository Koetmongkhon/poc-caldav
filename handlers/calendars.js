class Calendars {
  constructor(config) {
    this.config = config;
  }

  /** @type {import("../models/calendars")} */
  get model() {
    return global.models.calendars;
  }

  probfind(req, res) {
    try {
      const resultXml = this.model.probfind(req.body);
      res.set('Content-Type', 'text/xml');
      res.status(207);
      res.send(resultXml).end();
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json({"message": "internal server error"});
    }
  };
}

module.exports = Calendars;
