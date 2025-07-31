const { encodeHTML } = require("../utils/utils");
const { getXMLHead } = require("../utils/xml");

class Calendars {
  constructor(config) {
    this.config = config;
  };

  _isCheckSum(xmlDoc) {
    const nodeChecksum = xmlDoc.get('/A:propfind/A:prop/C:checksum-versions', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    return nodeChecksum !== undefined && nodeChecksum !== null;
  }

  _getCalendarRootNodeResponse(owner, children, isAll) {
    var response = "";

    response += "<d:response><d:href>" + this.config.davPrefix + "USERNAME" + "/CALENDAR-ID" + "</d:href>";
    response += "<d:propstat>";
    response += "<d:prop>";

    if (isAll) {
      response += "<d:owner><d:href>" + this.config.davPrefix + "p/" + owner + "/</d:href></d:owner>";
      response += "<d:resourcetype><d:collection/></d:resourcetype>";
    } else {
      var len = children.length;
      for (var i = 0; i < len; ++i) {
        var child = children[i];
        var name = child.name();
        switch (name) {
          // case 'current-user-privilege-set':
          //   response += getCurrentUserPrivilegeSet();
          //   break;

          case 'owner':
            response += "<d:owner><d:href>" + this.config.davPrefix + "p/" + owner + "/</d:href></d:owner>";
            break;

          case 'resourcetype':
            response += "<d:resourcetype><d:collection/></d:resourcetype>";
            break;

          // case 'supported-report-set':
          //   response += getSupportedReportSet(true);
          //   break;
        }
      }
    }

    response += "</d:prop>";
    response += "<d:status>HTTP/1.1 200 OK</d:status>";
    response += "</d:propstat>";
    response += "</d:response>";

    return response;
  }

  _returnPropfindElements(owner, calendar, children, isAll, callback) {
    var response = "";

    var token = "SYNC-TOKEN";

    if (isAll) {
      response += "<xical:calendar-color xmlns:xical=\"http://apple.com/ns/ical/\" symbolic-color=\"custom\">" + "#FFFFFF" + "</xical:calendar-color>";

      if (calendar.description)
        response += "<cal:calendar-description>" + calendar.description + "</cal:calendar-description>";

      response += "<cal:calendar-timezone>" + encodeHTML("Asia/Bangkok") + "</cal:calendar-timezone>";
      response += "<d:displayname>" + encodeHTML(calendar.displayname) + "</d:displayname>";
      response += "<d:owner><d:href>" + this.config.davPrefix + "p/" + owner + "/</d:href></d:owner>";
      response += "<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>";
      response += "<cal:schedule-calendar-transp><cal:opaque/></cal:schedule-calendar-transp>";
      response += "<d:sync-token>\"" + token + "\"</d:sync-token>";
    } else {
      var len = children.length;
      for (var i = 0; i < len; ++i) {
        var child = children[i];
        var name = child.name();
        switch (name) {
          // case 'add-member':
          //     response += "";
          //     break;

          // case 'allowed-sharing-modes':
          //   response += "<cs:allowed-sharing-modes><cs:can-be-shared/><cs:can-be-published/></cs:allowed-sharing-modes>";
          //   break;

          // case 'autoprovisioned':
          //     response += "";
          //     break;

          // case 'bulk-requests':
          //     response += "";
          //     break;

          case 'calendar-color':
            response += "<xical:calendar-color xmlns:xical=\"http://apple.com/ns/ical/\" symbolic-color=\"custom\">" + "#FFFFFF" + "</xical:calendar-color>";
            break;

          case 'calendar-description':
            if (calendar.description)
              response += "<cal:calendar-description>" + calendar.description + "</cal:calendar-description>";
            break;

          // case 'calendar-free-busy-set':
          //     response += "";
          //     break;

          // case 'calendar-order':
          //   if (!calendar.order)
          //     calendar.order = 1;
          //   response += "<cal:calendar-order>" + calendar.order + "</cal:calendar-order>";
          //   response += "<xical:calendar-order xmlns:xical=\"http://apple.com/ns/ical/\">" + calendar.order + "</xical:calendar-order>";
          //   break;

          case 'calendar-timezone':
            var timezone = "Asia/Bangkok";
            // if (timezone)
            //   timezone = timezone.replace(/\r\n|\r|\n/g, '&#13;\r\n');
            // else
            //   timezone = "";

            response += "<cal:calendar-timezone>" + timezone + "</cal:calendar-timezone>";
            break;

          // case 'current-user-privilege-set':
          //   response += getCurrentUserPrivilegeSet();
          //   break;

          // case 'default-alarm-vevent-date':
          //     response += "";
          //     break;

          // case 'default-alarm-vevent-datetime':
          //     response += "";
          //     break;

          case 'displayname':
            response += "<d:displayname>" + encodeHTML(calendar.displayname) + "</d:displayname>";
            break;

          // case 'language-code':
          //     response += "";
          //     break;

          // case 'location-code':
          //     response += "";
          // break;

          case 'owner':
            response += "<d:owner><d:href>" + prefix + "p/" + owner + "/</d:href></d:owner>";
            break;

          // TODO Fix URL
          // case 'pre-publish-url':
          //     response += "<cs:pre-publish-url><d:href>https://127.0.0.1/cal/" + username + "/" + calendar.pkey + "</d:href></cs:pre-publish-url>";
          //     break;

          // case 'publish-url':
          //     response += "";
          //     break;

          // case 'push-transports':
          //     response += "";
          //     break;

          // case 'pushkey':
          //     response += "";
          //     break;

          // case 'quota-available-bytes':
          //     response += "";
          //     break;

          // case 'quota-used-bytes':
          //     response += "";
          //     break;

          // case 'refreshrate':
          //     response += "";
          //     break;

          // case 'resource-id':
          //     response += "";
          //     break;

          case 'resourcetype':
            response += "<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>";
            break;

          case 'schedule-calendar-transp':
            response += "<cal:schedule-calendar-transp><cal:opaque/></cal:schedule-calendar-transp>";
            break;

          // case 'schedule-default-calendar-URL':
          //     response += "";
          //     break;

          // case 'source':
          //     response += "";
          //     break;

          // case 'subscribed-strip-alarms':
          //     response += "";
          //     break;

          // case 'subscribed-strip-attachments':
          //     response += "";
          //     break;

          // case 'subscribed-strip-todos':
          //     response += "";
          //     break;

          // case 'supported-calendar-component-set':
          //     response += "";
          //     break;

          // case 'supported-calendar-component-sets':
          //   response += "<cal:supported-calendar-component-set><cal:comp name=\"VEVENT\"/></cal:supported-calendar-component-set>";
          //   break;

          // case 'supported-report-set':
          //   response += getSupportedReportSet(false);
          //   break;

          // case 'getctag':
          //   response += "<cs:getctag>\"" + token + "\"</cs:getctag>";
          //   break;

          // case 'getetag':
          // no response?
          //response += "<d:getetag>http://swordlord.com/ns/sync/" + token + "</d:getetag>";
          // isGetEvent = true;
          // break;

          // case 'checksum-versions':
          // no response?
          // break;

          case 'sync-token':
            response += "<d:sync-token>\"" + token + "\"</d:sync-token>";
            break;

          // case 'acl':
          //   response += getACL(comm);
          //   break;

          // case 'getcontenttype':
          //response += "<d:getcontenttype>text/calendar;charset=utf-8</d:getcontenttype>";
          // break;

          default:
            if (name != 'text') console.log("CAL-PF: not handled: " + name);
            break;
        }
      }
    }

    if (callback) {
      callback(response);
    }
    return response;
  }

  _returnCalendar(owner, calendar, children, isAll) {
    var response = "";

    response += "	<d:response>";
    response += "		<d:href>" + this.config.davPrefix + "cal/" + owner + "/" + calendar.pkey + "/</d:href>";
    response += "		<d:propstat>";
    response += "			<d:prop>";

    response += this._returnPropfindElements(owner, calendar, children, isAll);

    response += "			</d:prop>";
    response += "			<d:status>HTTP/1.1 200 OK</d:status>";
    response += "		</d:propstat>";
    response += "	</d:response>";

    return response;
  }

  _isPropfind(xmlDoc) {
    const node = xmlDoc.get("/A:propfind", {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:carddav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    if (node && Object.keys(node).length != 0) {
      return true;
    }

    return false
  }

  _isAllProp(xmlDoc) {
    const temp = xmlDoc.get('/A:propfind/A:allprop', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    if (temp) {
      console.log("all prop");
      return true;
    }
    return false;
  }

  propfind(xmlDoc) {
    console.log("request propfind");
    if (!this._isPropfind(xmlDoc))
      throw new Error("invalid body")


    const node = xmlDoc.get('/A:propfind/A:prop', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });

    let response = getXMLHead();
    if (this._isCheckSum(xmlDoc)) {
      console.log("get summary");
      response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\">";
      response += "<d:response><d:href>" + this.config.davPrefix + "USERNAME" + "/CALENDAR-ID" + "</d:href></d:response>";
      response += "</d:multistatus>";
      return response;
    }

    const isAllProp = this._isAllProp(xmlDoc);

    console.log("get full");
    let children;
    if (!isAllProp)
      children = node.childNodes();

    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\">";
    response += this._getCalendarRootNodeResponse("USERNAME", children, isAllProp);

    const calendars = [
      {
        pkey: "CALENDAR_1",
        description: "CAL_1_description",
        displayname: "cal-1",
      }
    ];
    calendars.forEach(c => {
      response += this._returnCalendar("USERNAME", c, children, isAllProp);
    });
    response += "</d:multistatus>";
    return response;
  };
};

module.exports = Calendars;
