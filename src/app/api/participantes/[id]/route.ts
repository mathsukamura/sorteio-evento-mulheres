import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { situacao } = await req.json();

  if (!['Confirmado', 'Pendente', 'Cancelado'].includes(situacao)) {
    return NextResponse.json({ error: 'Situação inválida' }, { status: 400 });
  }

  db.prepare('UPDATE participantes SET situacao = ? WHERE id = ?').run(situacao, id);
  return NextResponse.json({ ok: true });
}
