# KanBad


A very basic (read: comically incomplete) Kanban app that serves as a
"try things in different ways" environment.

## Usage

Recommended apps to run are the [new Next.js](#new) front-end and the [new Rust/Actix](#new-rust-actix) back-end.

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

### New Rust-Actix

- Actix Web 4.3
- sqlx & sqlx-cli

This is the newest implementation using Rust, Actix, and sqlx (both for querying
and for running the migration). I had tried using Axum instead, as I'd wanted to
give it a shot for awhile now, but momentum was slow due to the paucity of learning materials, struggling with handler function signatures, etc. so I switched back to
the newest version of Actix Web and had it up and running in a few hours.

#### Setup

With `cargo` and PostgreSQL installed:

```bash
# If you need to create a user & database
$ createuser --createdb --login --pwprompt treclo
$ createdb -U treclo treclo

# Create a `.env` file in the rust-axum directory with the given password
# provided during `createuser` above
$ echo 'DATABASE_URL=postgresql://kanbad:<password>@localhost:5432/kanbad' > .env

# Install Diesel CLI to run migrations
$ cargo install sqlx-cli --no-default-features --features rustls,postgres
$ sqlx migrate run

# Now build & run the app!
$ cargo run
```

### Rust-Actix

- Actix-Web 0.7
- Diesel migrations

This is the old ~Jan 2019 implementation and is not feature-complete
and is not easy to update (eg. fix CORS) due to how old crate versions are.

### Java

- Dropwizard (Jetty, Jersey, etc.)
- Liquibase migrations

### Ruby

- Rails
- ActiveRecord migrations
