// import Database from 'tauri-plugin-sql-api'

// async function db(){
//   const db = await Database.load('postgres://postgres:jammy-one@localhost:1234/postgres')
//   console.log('response', response)
//   return db
// }

// export default db

import pgInit from 'pg-promise'

const pgp = pgInit()
export const db = pgp('postgres://postgres:jammy-one@localhost:1234/postgres')
