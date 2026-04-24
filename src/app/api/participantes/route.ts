import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const participantes = db.prepare(
    'SELECT * FROM participantes ORDER BY id DESC'
  ).all();
  return NextResponse.json(participantes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Import em lote
  if (Array.isArray(body)) {
    const insert = db.prepare(`
      INSERT INTO participantes (id_ingresso, participante, comprador, email, opcao_ingresso, situacao, codigo_desconto, data_venda, hora_venda, data_cancelamento, data_validacao, whatsapp, legendario, cidade, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((rows: any[]) => {
      for (const r of rows) {
        insert.run(
          r.id_ingresso || null, r.participante, r.comprador || null,
          r.email || null, r.opcao_ingresso || null, r.situacao || 'Confirmado',
          r.codigo_desconto || null, r.data_venda || null, r.hora_venda || null,
          r.data_cancelamento || null, r.data_validacao || null,
          r.whatsapp || null, r.legendario || null, r.cidade || null, r.estado || null
        );
      }
    });
    insertMany(body);
    return NextResponse.json({ imported: body.length });
  }

  // Insert individual
  const { participante, comprador, email, opcao_ingresso, situacao, whatsapp, cidade, estado } = body;
  if (!participante || participante.trim() === '') {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }
  const result = db.prepare(`
    INSERT INTO participantes (participante, comprador, email, opcao_ingresso, situacao, whatsapp, cidade, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(participante.trim(), comprador || null, email || null, opcao_ingresso || null, situacao || 'Confirmado', whatsapp || null, cidade || null, estado || null);

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
  const { id, deleteAll } = await req.json();
  if (deleteAll) {
    db.prepare('DELETE FROM participantes').run();
    db.prepare('DELETE FROM sorteios').run();
  } else {
    db.prepare('DELETE FROM participantes WHERE id = ?').run(id);
  }
  return NextResponse.json({ ok: true });
}
