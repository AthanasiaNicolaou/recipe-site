# Recipe Sharing Website

A multi-user recipe-sharing web app built from scratch with Node.js and Express. Users can sign up, log in, post recipes with ingredients and instructions, and manage their own posts.

Built as a learning project to practice full-stack fundamentals — server-side routing, templating, relational databases, and authentication.

## Features

- **User accounts** — sign up and log in, with passwords securely hashed (bcrypt), never stored in plain text
- **Sessions** — stay logged in across page visits via `express-session`
- **Post recipes** — title, ingredients, instructions, and time needed
- **Browse recipes** — homepage lists every recipe posted by any user
- **View a single recipe** — full ingredients and instructions on their own page
- **Delete your own recipes** — with a confirmation prompt before deleting, and ownership checks so you can only delete recipes you posted
- **Basic styling** — a real stylesheet instead of unstyled browser defaults

## Tech stack

| Purpose | Tool |
|---|---|
| Server / runtime | Node.js + Express |
| Templating | EJS |
| Database | SQLite (via `better-sqlite3`) |
| Auth | `express-session` + `bcrypt` |
| Styling | Plain CSS |

## Project structure

```
my-recipe-site/
├── server.js              # entry point — all routes and middleware
├── db/
│   └── db.js                # database connection + table schemas
├── views/                  # EJS templates (the actual pages)
│   ├── index.ejs             # homepage — lists all recipes
│   ├── recipe.ejs             # single recipe view
│   ├── new.ejs                 # form to post a new recipe
│   ├── signup.ejs               # create account form
│   ├── login.ejs                 # log in form
│   └── login-error.ejs             # shown when login fails
├── public/
│   └── css/
│       └── style.css           # site styling
├── package.json
└── .gitignore
```

## Running it locally

**Requirements:** [Node.js](https://nodejs.org/) installed.

```bash
npm install
node server.js
```

Then open **http://localhost:3000** in your browser.

The database (`db/recipes.sqlite`) is created automatically the first time the server runs.

## What I learned building this

- How a request actually travels from browser → Express route → database → back to the browser as HTML
- Why templating engines (EJS) exist, and what plain HTML can't do on its own
- Parameterized SQL queries, and why they matter for security
- Debugging with `console.log`, reading stack traces, and checking a database's real contents directly rather than guessing
- Git basics, including resolving a real merge conflict

## Known limitations / not yet built

- No way to **edit** an existing recipe yet (can only create or delete)
- No image uploads
- Not deployed anywhere yet
- Session secret and other config values are hardcoded rather than pulled from environment variables

## Roadmap

- [ ] Edit recipe functionality
- [ ] Image uploads for recipes
- [ ] Deploy to a live URL
- [ ] Move secrets to environment variables before deploying
