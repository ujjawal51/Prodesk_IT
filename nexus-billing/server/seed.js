import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {database} from './db.js';
if(!process.env.SEED_PASSWORD||process.env.SEED_PASSWORD.length<12)throw Error('Set SEED_PASSWORD to a unique password of at least 12 characters');
const db=database(process.env.DB_PATH||'./data/nexus.db');
const hashedPassword = await bcrypt.hash(process.env.SEED_PASSWORD, 12);
for(const [name,email,role] of [['Nexus Admin','admin@nexus.test','Admin'],['Alex Morgan',process.env.CLIENT_EMAIL||'alex@nexus.test','Client'],['Jamie Lee','jamie@nexus.test','Client']]){
  const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email);
  if(existing){
    db.prepare('UPDATE users SET password=?, name=?, role=? WHERE id=?').run(hashedPassword, name, role, existing.id);
  } else {
    db.prepare('INSERT INTO users(id,email,name,password,role) VALUES(?,?,?,?,?)').run(randomUUID(),email,name,hashedPassword,role);
  }
}
console.log(`Seeded/Updated admin@nexus.test, ${process.env.CLIENT_EMAIL||'alex@nexus.test'}, jamie@nexus.test.`);db.close();
