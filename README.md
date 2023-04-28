# TreClo


A very basic (read: comically incomplete) Trello clone that serves as a
"try things in different ways" environment.

## Usage

Recommended apps to run are the [new Next.js](#new) front-end and the [Rust/Actix Web](#rust) back-end.

## Front End

### Old

React/TypeScript/Redux

This was the original front-end (circa late 2018) and no longer even builds properly,
in large part because of `node-sass` and `node-gyp` issues, but it was class-based
with 'deprecated' patterns anyway, so...

### New

... it made sense to just rewrite it with React/TypeScript/Next.js to use more modern patterns.

#### Setup

## Back Ends

Each back end must..

- Control database migrations
- Support full CRUD for workspaces, boards, and cards
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