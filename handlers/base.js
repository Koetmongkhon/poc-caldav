class Base {
  constructor(config) {
    this.config = config;
  }

  responseXml(res, status, body) {
    console.log("Response:", body);
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.status(status);
    res.send(body).end();
  }

  newContext(req) {
    const { user, calId, eventId } = req.params;
    /*
      resource_Meeting_room@resource_1618825725205
      {resource}_{state}
    */
    let resource;
    let state;
    if (calId) {
      const calIdFormat = calId.split("@");
      resource = calIdFormat[0];
      if (calIdFormat.length > 1)
        state = calIdFormat[1];
    }
    // TODO: get user information from JWT?
    const session = {
        "id": user || "10498",
        "org_id": "1",
        "user": "teamdev"
    };
    const ctx = {
      user: user || "10498",
      calId: resource,
      eventId,
      path: req.absPath || req.path,
      state,
      session,
    };
    console.log(ctx);
    return ctx;
  };
}

module.exports = Base;
