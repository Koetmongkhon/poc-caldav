const xml = require("libxmljs");

const xmlParser = (req, res, next) => {
  console.log("parsing xml");
  try {
    if (req.rawBody) {
      console.log(req.rawBody);
      req.body = xml.parseXml(req.rawBody);
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json("invalid body");
    return;
  }
}

module.exports = {
  xmlParser,
};
