const moment = require('moment')
const path = require('path')

module.exports = {
    generateBackupPath(databaseName, rootPath, now = null) {
        now = now || moment()
        const timestamp = moment(now).format('DD-MM-YYYY@HH-mm-ss')
        const day = moment(now).format('YYYY-MM-DD')

        const filename = `${databaseName}-${timestamp}.` + process.env.BACKUP_EXTENSION
        const key = path.join(rootPath || '', day, filename)
        return key
    }
}
