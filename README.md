# TreClo

A very basic (read: comically incomplete) Trello clone that serves as a
"try things in different ways" environment.

## Usage



## Front End

Currently only has a single front end, using TypeScript with React & Redux.

### TypeScript/React

#### Setup

## Back Ends

The meat of the playing around, each back end must..

- Control database migrations
- Full CRUD for workspaces, boards, and cards
- Serve JSON for front-end consumption

### Rust

- Actix-Web
- Diesel migrations

#### Setup

With `cargo` and PostgreSQL installed:

```bash
# If you need to create a user & database
$ createuser --createdb --login --pwprompt treclo
$ createdb -U treclo treclo

# Export the database connection string to an env var, making sure to
# replace `<password>` with whatever you supplied during `createuser` above
$ export TRECLO_DATABASE_URL=postgresql://treclo:<password>@localhost:5432/treclo

# Install Diesel CLI to run migrations
$ cargo install diesel_cli
$ DATABASE_URL=$TRECLO_DATABASE_URL diesel migration run

# Now build & run the app!
$ cargo run
```

### Java

- Dropwizard (Jetty, Jersey, etc.)
- Liquibase migrations

#### Setup

TODO

### Ruby

- Rails
- ActiveRecord migrations

#### Setup

TODO