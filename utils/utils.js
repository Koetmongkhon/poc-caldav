function encodeHTML(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"]/g, function (m) { return map[m]; });
}

module.exports = {
  encodeHTML,
};
