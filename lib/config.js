const path = require('path')

module.exports = {
    S3_REGION: process.env.S3_REGION,
    PGDUMP_PATH: "/usr/bin/",
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGHOST: process.env.PGHOST,
    S3_BUCKET: process.env.S3_BUCKET,
    ENCRYPTION_PASSWORD: process.env.ENCRYPTION_PASSWORD,
    S3_STORAGE_CLASS: process.env.S3_STORAGE_CLASS,
    S3_URL: process.env.S3_URL
}
