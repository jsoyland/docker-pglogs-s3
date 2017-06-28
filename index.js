const handler = require('./lib/handler')

module.exports.handler = handler

// run without event or context
handler(null,null,function(){})
