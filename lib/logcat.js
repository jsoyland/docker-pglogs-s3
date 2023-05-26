const spawn = require('child_process').spawn
const through2 = require('through2')
const path = require('path')
const fs = require('fs')

function spawnLogCat(config) {
    let pgYesterdaysLog= 'postgresql-' + new Date(Date.now() - (24 * 60 * 60 * 1000)).toLocaleString('en-us', {  weekday: 'short' }) + '.log';
//    const pgLogPath = path.join(config.PGLOG_PATH, pgYesterdaysLog)
    const pgLogPath = path.join(config.PGLOG_PATH, "package.json")

    return spawn('cat', [pgLogPath])
}

function logcatWrapper(config, logCatSpawnFn = spawnLogCat) {
    return new Promise((resolve, reject) => {
        let headerChecked = false
        let stderr = ''

        // spawn log cat process
        const process = logCatSpawnFn(config)

        // hook into the process
        process.stderr.on('data', (data) => {
            stderr += data.toString('utf8')
        })

        process.on('close', code => {
            // reject our promise if log cat had a non-zero exit
            if (code !== 0) {
                return reject(
                    new Error('log cat process failed: ' + stderr)
                )
            }
            // check that the log cat actually gave us some data
            if (!headerChecked) {
                return reject(
                    new Error('log cat gave us an unexpected response')
                )
            }
            return null
        })

        // use through2 to proxy the cat stdout stream
        // so we can check it's valid
        const buffer = through2(function (chunk, enc, callback) {
            this.push(chunk)
            // make sure that there is data coming back, else abort
            if (!headerChecked) {
                headerChecked = true
                const chunkStr = chunk.toString('utf8')
                // check if we got something back from the server
                // that was longer than 40 chars, so probably actual data
                // and not just the psql header message
                if (chunkStr.length > 40) {
                    resolve(buffer)
                }
                else {
                    reject(
                        new Error('logcat gave us an unexpected response ' + chunk.toString('utf8'))
                    )
                }
            }
            callback()
        })

        // pipe log cat to buffer
        process.stdout.pipe(buffer)
    })
}
module.exports = logcatWrapper
