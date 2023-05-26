# docker-pglogs-s3

# Overview

A docker container that streams postgres logs to s3.

It run inside a docker container on a cron schedule that is specified by the `CRON_SCHEDULE` environment variable.

This was forked from https://github.com/seated/docker-pgdump-s3, but modified to instead of running pg_dump just
cats yesterday's postgres logfile.  There's probably no reason for this to use streaming unless this were modified
to tail the current logfile instead, but it was simple enough to modify the existing container for this purpose.

# Requirements

- S3 bucket
- AWS credentials to push to S3 bucket
- Path to Postgres logs.

To get the path to the Postgres logs, query Postgres:

```
SELECT
    ddir.setting || '/' || logdir.setting
FROM (
    SELECT
        setting
    FROM
        pg_settings
    WHERE
        category = 'File Locations'
        AND name = 'data_directory'
    LIMIT 1) AS ddir,
    (
        SELECT
            setting
        FROM
            pg_settings
        WHERE
            category = 'Reporting and Logging / Where to Log'
            AND setting = 'log'
        LIMIT 1) AS logdir;
```

The log filename is formatted by the day of the week, ie "postgresql-Mon.log" but when it's copied to S3 it's changed to the date.

# Quick Start

To run at 1am daily inside pgpodman, the intended use of this container:
```
select run_container('-dt -v /var/lib/pgsql/15/data/log:/pglogs  -e S3_BUCKET=jessebucket -e S3_REGION=us-east-1 -e AWS_ACCESS_KEY_ID=AK -e AWS_SECRET_ACCESS_KEY=s01 -e BACKUP_EXTENSION=log -e S3_STORAGE_CLASS=STANDARD -e CRON_SCHEDULE="0 1 * * *" -e S3_URL="s3://jessebucket/pglogs/" --privileged docker.io/jsoyland/docker-pglogs-s3');

```

For running in podman/docker directly:
```
podman run -dt \
   -v /var/lib/pgsql/15/data/log:/pglogs \
   -e S3_BUCKET=jessebucket \
   -e S3_REGION=us-east-1 \
   -e AWS_ACCESS_KEY_ID=AK \
   -e AWS_SECRET_ACCESS_KEY=s0 \
   -e BACKUP_EXTENSION=log \
   -e S3_STORAGE_CLASS=GLACIER \
   -e CRON_SCHEDULE="0 1 * * *" \
   -e S3_URL="s3://jessebucket/folder/" \
   --privileged \
   docker.io/jsoyland/docker-pglogs-s3
```
