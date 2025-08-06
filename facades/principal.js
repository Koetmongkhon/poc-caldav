const { getXMLHead } = require("../utils/xml");

class Principal {
  constructor(config) {
    this.config = config;
  }

  getSupportedReportSet() {
    var response = "";
    response += "        <d:supported-report-set>\r\n";
    response += "        	<d:supported-report>\r\n";
    response += "        		<d:report>\r\n";
    response += "        			<d:expand-property/>\r\n";
    response += "        		</d:report>\r\n";
    response += "        	</d:supported-report>\r\n";
    response += "        	<d:supported-report>\r\n";
    response += "        		<d:report>\r\n";
    response += "        			<d:principal-property-search/>\r\n";
    response += "        		</d:report>\r\n";
    response += "        	</d:supported-report>\r\n";
    response += "        	<d:supported-report>\r\n";
    response += "        		<d:report>\r\n";
    response += "        			<d:principal-search-property-set/>\r\n";
    response += "        		</d:report>\r\n";
    response += "        	</d:supported-report>\r\n";
    response += "        </d:supported-report-set>\r\n";

    return response;
  }

  getCalendarUserAddressSet(ctx) {
    var response = "";

    response += "        <cal:calendar-user-address-set>\r\n";
    response += "        	<d:href>mailto:" + ctx.user + "</d:href>\r\n";
    response += "        	<d:href>" + "/caldav/p/" + ctx.user + "/</d:href>\r\n";
    response += "        </cal:calendar-user-address-set>\r\n";

    return response;
  }

  propfind(ctx, xmlDoc) {
    console.log("principal");

    let response = getXMLHead();
    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\">";
    response += "<d:response><d:href>" + "/caldav" + "</d:href>";
    response += "<d:propstat>";
    response += "<d:prop>";

    var node = xmlDoc.get('/A:propfind/A:prop', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    var childs = node.childNodes();

    var len = childs.length;
    for (var i = 0; i < len; ++i) {
      var child = childs[i];
      var name = child.name();
      switch (name) {
        case 'checksum-versions':
          response += "";
          break;

        // case 'sync-token':
        //     response += "<d:sync-token>http://sabredav.org/ns/sync/5</d:sync-token>";
        //     break;

        case 'supported-report-set':
          response += this.getSupportedReportSet();
          break;

        case 'principal-URL':
          response += "<d:principal-URL><d:href>" + "/caldav/p/" + ctx.user + "/</d:href></d:principal-URL>\r\n";
          break;

        case 'displayname':
          response += "<d:displayname>" + ctx.user + "</d:displayname>";
          break;

        case 'principal-collection-set':
          response += "<d:principal-collection-set><d:href>" + "/caldav/p/</d:href></d:principal-collection-set>";
          break;

        case 'current-user-principal':
          response += "<d:current-user-principal><d:href>" + "/caldav/p/" + ctx.user + "/</d:href></d:current-user-principal>";
          break;

        case 'calendar-home-set':
          response += "<cal:calendar-home-set><d:href>" + "/caldav/cal/" + ctx.user + "</d:href></cal:calendar-home-set>";
          break;

        // case 'schedule-outbox-URL':
        //     response += "<cal:schedule-outbox-URL><d:href>"+ prefix +"/cal/" + comm.getUser().getUserName() + "/outbox</d:href></cal:schedule-outbox-URL>";
        //     break;

        // case 'schedule-inbox-URL':
        //     response += "<cal:schedule-inbox-URL><d:href>"+ prefix +"/cal/" + comm.getUser().getUserName() + "/inbox</d:href></cal:schedule-inbox-URL>";
        // break;

        case 'calendar-user-address-set':
          response += this.getCalendarUserAddressSet();
          break;

        // case 'notification-URL':
        //     response += "<cs:notification-URL><d:href>"+ prefix +"/cal/" + comm.getUser().getUserName() + "/notifications/</d:href></cs:notification-URL>";
        //     break;

        case 'getcontenttype':
          response += "";
          break;

        // case 'addressbook-home-set':
        //     response += "<card:addressbook-home-set><d:href>"+ prefix +"/card/" + comm.getUser().getUserName() + "/</d:href></card:addressbook-home-set>";
        //     break;

        case 'directory-gateway':
          response += "";
          break;
        // case 'email-address-set':
        //     response += "<cs:email-address-set><cs:email-address>lord test at swordlord.com</cs:email-address></cs:email-address-set>";
        //     break;
        case 'resource-id':
          response += "";
          break;

        default:
          if (name != 'text') log.warn("P-PF: not handled: " + name);
          break;
      }
    }

    response += "</d:prop>";
    response += "<d:status>HTTP/1.1 200 OK</d:status>";
    response += "</d:propstat>";
    response += "</d:response>";
    response += "</d:multistatus>";

    return response;
  }

}

module.exports = Principal;
