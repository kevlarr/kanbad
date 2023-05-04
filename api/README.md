# Kanbad API

This iteration of the API was originally intended to be written with Axum,
since I had wanted to try out that newer framework for quite some time.

After spending cycles on it and struggling even to get handlers that extract app state & JSON request bodies to compile, I wound up [replacing it](https://github.com/kevlarr/kanbad/pull/69/commits/e77c60a202a7d2989ed0adf055ad72ba185e2d14) with Actix Web again, primarily
because the latter is _so much_ better documented that it is significantly easier
to gain momentum.

## Setup


With `cargo` and PostgreSQL tools installed:

```bash
$ cd <project-root>/api

# If you need to create a user & database
$ createuser --createdb --login --pwprompt kanbad
$ createdb -U kanbad kanbad

# Create a `.env` file in the root `./api` directory with the given password
# provided during `createuser` above
$ echo 'DATABASE_URL=postgresql://kanbad:<password>@localhost:5432/kanbad' > .env

# Install SQLx CLI to run migrations
$ cargo install sqlx-cli --no-default-features --features rustls,postgres
$ sqlx migrate run

# Build & run the app. A fresh build might take several minutes, although as I
# develop on a mid-range 2015 Macbook, my mileage might be much worse than yours.
$ cargo run
```
