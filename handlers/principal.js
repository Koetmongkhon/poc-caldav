const Base = require("./Base");

class Principal extends Base {
  constructor(config) {
    super(config);
  }

  /**@type {import ("../facades/principal")} */
  get facade() {
    return global.facades.principal;
  }

  propfind(req, res) {
    try {
      const ctx = this.newContext(req);
      const resultXml = this.facade.propfind(ctx, req.body);
      // set DAV header
      res.set("DAV", "1, 3, extended-mkcol, calendar-access, calendar-schedule, calendar-proxy, calendarserver-sharing, calendarserver-subscribed, calendarserver-principal-property-search, calendar-auto-schedule");
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
}

module.exports = Principal;
