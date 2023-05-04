# Kanbad


A very basic (read: comically incomplete) Kanban app that provides a
"try the same things in different ways" learning environment.
And since all apps are essentially first-pass POCs, there is much room for improvement - even for adding things like "proper error handling", adapting more idiomatic patterns, or just reducing boilerplate and copy & paste.

Eventually it would be *nice* to have a polished design & user experience,
but whether or not that will happen depends on work & life circumstances.

---

The most current (ie. ‘working’) iteration of the project is comprised of:

- A **TypeScript** & **Next.js** (v13) React [front-end](./web)
- A **Rust**, **Actix Web** (v4), and **SQLx** [back-end](./api)


The [_archive](./_archive) directory contains all previous front- & back-end iterations, including:

- A **TypeScript** & **React/Redux** front-end (with a homegrown router because it felt like the wild west for React in 2018)
- A **Java** & **Dropwizard/Jersey** API (which was the 'canonical' back-end for the project at the time)
- A feature-complete (I think) **Ruby on Rails** API (originally spun up in order to add back-end features faster than in Java app so I could focus on front-end dev, but... abandoned)
- A feature-incomplete **Rust**, **Actix Web** (v0.7), and **Diesel** APi (to see how it felt to write a Rust web server compared to a Java one - it was much nicer, even in 2019, but I stopped working on the repo after accepting a new job)

## Setup

1. Build & run the [API](./api/README.md)
2. Build & run the [web client](./web/README.md)
3. Enjoy (?)
