const moment = require('moment')
const path = require('path')

module.exports = {
    generateBackupPath(databaseName, rootPath, now = null) {
        now = now || moment()
        const day = moment(now).format('YYYY-MM-DD')

        const filename = `${databaseName}-${day}.` + process.env.BACKUP_EXTENSION
        const key = path.join(rootPath || '', filename)
        return key
    }
}
