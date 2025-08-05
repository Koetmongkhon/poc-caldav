function encodeHTML(str) {
  if (str == undefined || str == null)
    return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return str.replace(/[&<>"]/g, function (m) { return map[m]; });
}

module.exports = {
  encodeHTML,
};
