const path = require('path')

module.exports = {
    S3_REGION: process.env.S3_REGION,
    PGDUMP_PATH: "/usr/bin/",
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGHOST: process.env.PGHOST,
    S3_BUCKET: process.env.S3_BUCKET,
    ENCRYPTION_PASSWORD: process.env.ENCRYPTION_PASSWORD
}
