const { Upload } = require('@aws-sdk/lib-storage')
const { S3, S3Client } = require('@aws-sdk/client-s3')
const Timer = require('./timer')
const { PassThrough, pipeline } = require('stream')

module.exports = async (stream, { S3_BUCKET, S3_REGION, S3_STORAGE_CLASS, S3_URL }, Key) => {
    if (!stream || typeof stream.on !== 'function') {
        throw new Error('invalid stream provided')
    }

    const passThrough = new PassThrough()
    pipeline(stream, passThrough, () => {})

    try {
        const timer = new Timer()
        console.log(
          'streaming dump to s3 ' +
          `bucket=${S3_BUCKET}, ` +
          `key=${Key} ` +
          `region=${S3_REGION} ` +
          `storageclass=${S3_STORAGE_CLASS} ` +
          `url=${S3_URL}`
      )

        const clientOpts = {
            region: `${S3_REGION}`
        }

        // begin upload to s3
        const upload = new Upload({
            client: new S3(clientOpts) || new S3Client(clientOpts),

            params: {
                Body: passThrough,
                Bucket: `${S3_BUCKET}`,
                Key,
              // ACL: 'bucket-owner-full-control',
                StorageClass: `${S3_STORAGE_CLASS}`
            },

            leavePartsOnError: true
        })
        upload.on('httpUploadProgress', (progress) => {
            console.log(progress)
        })

        const data = await upload.done()
        console.log(
                    'SUCCESS: The backup was uploaded to ' +
                    `${data.Location} in ${timer.elapsedString()}`
                )
        return data.Location
    }
    catch (error) {
        console.log(error)
    }
}
