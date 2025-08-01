class Base {
  constructor(config) {
    this.config = config;
  }

  responseXml(res, status, body) {
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.status(status);
    res.send(body).end();
  }

  newContext(req) {
    const { user, calId, eventId } = req.params;
    const ctx = {
      user,
      calId,
      eventId,
      path: req.absPath || req.path,
    };
    console.log(ctx);
    return ctx;
  };
}

module.exports = Base;
