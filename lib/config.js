const path = require('path')

module.exports = {
    S3_REGION: process.env.S3_REGION,
    PGLOG_PATH: "/pglogs/",
    S3_BUCKET: process.env.S3_BUCKET,
    S3_STORAGE_CLASS: process.env.S3_STORAGE_CLASS,
    S3_URL: process.env.S3_URL
}
