const moment = require('moment')

module.exports = {
    generateBackupPath(now = null) {
        now = now || moment()
        const day = moment(now).subtract(1, 'days').format('YYYY-MM-DD')

        const filename = `postgresql-${day}.` + process.env.BACKUP_EXTENSION
        return filename
    }
}
