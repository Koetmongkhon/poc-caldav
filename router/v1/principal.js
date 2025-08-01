const { xmlParser } = require("../../middlewares/xml_parser");

const {
  principal,
} = global.handlers;
const router = require("express").Router();

// not support LOCK, UNLOCK, COPY, MOVE, MKCOL || MKCALENDAR, AUDIO
router.propfind("*params", xmlParser, principal.propfind.bind(principal));

module.exports = router;
