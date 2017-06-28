// entrypoint for execution
var CronJob = require('cron').CronJob;

const handler = require('./lib/handler')

module.exports.handler = handler

new CronJob('*/5 * * * *', function(){
  console.log('Running cron task at ' + new Date())
  // run the backup script
  handler(null, null, function(){})
}, null, true, 'America/Los_Angeles');

// run without event or context for execution outside of lambda environment
//handler(null,null,function(){})
