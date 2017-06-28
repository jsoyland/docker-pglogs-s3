# docker-pgdump-s3

# Overview

A docker container that runs pg_dump and streams the output to s3.

It run inside a docker container on a cron schedule that is specified by the `CRON_SCHEDULE` environment variable.

The original project was designed to run in AWS lambda. Our requirements meant went we needed more than 5 minutes of execution
time to run `pg_dump`. Therefore, the service has been altered to run on a cron schedule.

The service utilizes AWS S3 multi-part uploads & streaming. This means there is no need for large amounts of local storage where 
the docker container is running, as the data is proxied directly to AWS without being written to disk. This results in a low memory footprint (~50mb) for the running service during backup, and fairly low CPU usage (~5% when testing during dumping). 

The architecture looks like:

```
[Postgres DB] ---> [docker-pgdump-s3] ---> [AWS S3 bucket]
```


# Requirements

- S3 bucket
- AWS credentials to push to S3 bucket
- Postgres host, username, password

# Quick Start

`docker run -d --env-file=service.env tozny/docker-pgdump-s3`

Or with the environment variables spelled out:

```
docker run -d \
  -e PGPASSWORD=password \
  -e PGDATABASE=mydatabase \
  -e PGUSER=root \
  -e PGHOST=localhost \
  -e S3_BUCKET=muhbucket \
  -e S3_REGION=us-west-2 \
  -e AWS_ACCESS_KEY_ID=AK \
  -e AWS_SECRET_ACCESS_KEY=SK \
  -e PG_PARAMS="-Fp -a"
  -e BACKUP_EXTENSION=backup
  -e CRON_SCHEDULE="* * * * *"
  # only specify if you want AES encrypted backups, otherwise leave out
  -e ENCRYPTION_PASSWORD=password
```

