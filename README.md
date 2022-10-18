# Jammy

Multiplayer local-first native macOS app for indexing your stuff. Works offline.

Built with [Tauri](https://tauri.app/), [Next.js](https://nextjs.org/), [Replicache](https://replicache.dev), [DBngin](https://dbngin.com/), [Postgres](https://www.postgresql.org/), [TailwindCSS](https://tailwindcss.com/).

## Getting Started

Install Tauri CLI:

```bash
npm install --save-dev @tauri-apps/cli
```

Install Postgres on MacOS

```bash
brew update
brew install postgresql
```

Download and install [DBngin](https://dbngin.com/).

Using DBngin create a new PostgreSQL database server.

Using DBngin start your PostgreSQL database server.

Download and install [TablePlus](https://tableplus.com/).

Using DBngin open your PostgreSQL database in TablePlus.

Your Postgres URI is: postgres://postgres:[name]@localhost:[port]/postgres

Example: postgres://postgres:jammy-one@localhost:1234/postgres

Run the development server:

```bash
npm run tauri dev
```

A little desktop app will appear.

![screenshot](./public/screenshot-full.png)

In a new browser tab visit `localhost:3000/api/init` to create the `message` and `replicache-client` tables in your PostgreSQL database. This is successful if you recieve an `ok` in the browser.

You can now start submitting messages in the little desktop app.

Note: When clicking the Submit button, Replicache implements a mutation on the client-side (IndexedDB) and a mutation on the server (local Postgres). On the next pull, the client-side (IndexedDB) is updated with the authoritative changes of the server (local Postgres).

In this toy app, the local Postgres is the authoritative server.

## Coming soon
The idealistic goal is to change the responsibility of the server. The native client is not reliant on the cloud server. This is achieved with the native client reading and writing to copy of the database held in a local Postgres server. The cloud servers' purpose is enabling an instant-ui multiplayer experience for clients syncing data between native clients and web clients.

- listen for changes to the local Postgres server notifying clients to pull
- push local Postgres mutations to cloud server (Supabase Postgres or Reflect Cloudflare Durable Objects) enabling multiplayer across devices
- listen for changes to cloud server and pull changes to local Postgres









