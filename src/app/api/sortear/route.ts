import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
  const jaGanhou = db.prepare('SELECT participante_id FROM sorteios').all().map((r: any) => r.participante_id);

  let query = "SELECT * FROM participantes WHERE situacao = 'Confirmado'";
  if (jaGanhou.length > 0) {
    query += ` AND id NOT IN (${jaGanhou.join(',')})`;
  }
  const disponiveis: any[] = db.prepare(query).all();

  if (disponiveis.length === 0) {
    return NextResponse.json({ error: 'Nenhuma participante disponível' }, { status: 400 });
  }

  const sorteada = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  db.prepare('INSERT INTO sorteios (participante_id) VALUES (?)').run(sorteada.id);

  return NextResponse.json(sorteada);
}
