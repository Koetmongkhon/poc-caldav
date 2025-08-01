class Base {
  constructor(config) {
    this.config = config;
  }

  responseXml(res, status, body) {
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.status(status);
    res.send(body).end();
  }
}

module.exports = Base;
