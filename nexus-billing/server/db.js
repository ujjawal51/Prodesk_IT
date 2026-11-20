import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
export function database(path){
 if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path); db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('Admin','Client')));
 CREATE TABLE IF NOT EXISTS invoices(id TEXT PRIMARY KEY,client_id TEXT NOT NULL REFERENCES users(id),description TEXT NOT NULL,amount INTEGER NOT NULL CHECK(amount>0),currency TEXT NOT NULL DEFAULT 'usd',due_date TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Outstanding',paid_at TEXT,payment_id TEXT UNIQUE,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,invoice_id TEXT UNIQUE NOT NULL REFERENCES invoices(id),created INTEGER NOT NULL,session_id TEXT UNIQUE);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY);
 CREATE TABLE IF NOT EXISTS deliveries(invoice_id TEXT PRIMARY KEY REFERENCES invoices(id),pdf BLOB,sent INTEGER NOT NULL DEFAULT 0,tries INTEGER NOT NULL DEFAULT 0,next_try INTEGER NOT NULL DEFAULT 0);
 `);return db;
}
export function transaction(db,fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
