class Base {
  constructor(config) {
    this.config = config;
  }

  responseXml(res, status, body) {
    res.set('Content-Type', 'text/xml');
    res.status(status);
    res.send(body).end();
  }
}

module.exports = Base;
