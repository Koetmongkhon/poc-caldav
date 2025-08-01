class Base {
  constructor(config) {
    this.config = config;
  }

  parseHrefToIcsId(href) {
    var e = href.split("/");
    var id = e[e.length - 1];

    return id.substr(0, id.length - 4);
  }
}

module.exports = Base;
