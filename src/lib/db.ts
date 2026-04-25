import Database from 'better-sqlite3';
import path from 'path';

const dataDir = process.env.DATA_DIR || process.cwd();
const dbPath = path.join(dataDir, 'rifa.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_ingresso TEXT,
    participante TEXT NOT NULL,
    comprador TEXT,
    email TEXT,
    opcao_ingresso TEXT,
    situacao TEXT DEFAULT 'Confirmado',
    codigo_desconto TEXT,
    data_venda TEXT,
    hora_venda TEXT,
    data_cancelamento TEXT,
    data_validacao TEXT,
    whatsapp TEXT,
    legendario TEXT,
    cidade TEXT,
    estado TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sorteios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participante_id INTEGER NOT NULL,
    presente INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participante_id) REFERENCES participantes(id)
  );
`);

export default db;
