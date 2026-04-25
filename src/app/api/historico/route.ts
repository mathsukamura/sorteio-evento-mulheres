import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const historico = db.prepare(`
    SELECT s.id, s.created_at, s.presente, p.participante as nome, p.whatsapp, p.cidade, p.estado
    FROM sorteios s
    JOIN participantes p ON s.participante_id = p.id
    ORDER BY s.created_at DESC
  `).all();
  return NextResponse.json(historico);
}

export async function PATCH(req: NextRequest) {
  const { id, presente } = await req.json();
  db.prepare('UPDATE sorteios SET presente = ? WHERE id = ?').run(presente ? 1 : 0, id);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  db.prepare('DELETE FROM sorteios').run();
  return NextResponse.json({ ok: true });
}
