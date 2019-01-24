const AWS = require('aws-sdk')
const Timer = require('./timer')

// configure AWS to log to stdout
AWS.config.update({
    logger: process.stdout
})

module.exports = function (stream, config, key) {
    if (!stream || typeof stream.on !== 'function') {
        throw new Error('invalid stream provided')
    }
    return new Promise((resolve, reject) => {
        const timer = new Timer();
        console.log(
            'streaming dump to s3 ' +
            `bucket=${config.S3_BUCKET}, ` +
            `key=${key} ` +
            `region=${config.S3_REGION}` +
            `storageclass=${config.S3_STORAGE_CLASS}` +
            `url=${config.S3_URL}`
        )
        const s3 = new AWS.S3({
            params: {
                Bucket: config.S3_BUCKET,
                Key: key,
                //ACL: 'bucket-owner-full-control',
                StorageClass: config.S3_STORAGE_CLASS
            },
            endpoint: config.S3_URL
        })

        // begin upload to s3
        s3.upload({
            Body: stream
        })
        .send((err, data) => {
            if (err) {
                reject(err)
            }
            else {
                console.log(
                    'SUCCESS: The backup was uploaded to ' +
                    `${data.Location} in ${timer.elapsedString()}`
                )
                resolve(data.Location)
            }
        })
    })
}
