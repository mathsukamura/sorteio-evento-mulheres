import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Planilha vazia' }, { status: 400 });
    }

    // Mapear colunas — tenta encontrar pelo nome
    const firstRow = rows[0];
    const keys = Object.keys(firstRow);

    function findCol(...terms: string[]): string | null {
      for (const t of terms) {
        const found = keys.find(k => k.toLowerCase().includes(t.toLowerCase()));
        if (found) return found;
      }
      return null;
    }

    const colId = findCol('ID');
    const colParticipante = findCol('Participante');
    const colComprador = findCol('Comprador');
    const colEmail = findCol('Email');
    const colIngresso = findCol('Ingresso', 'Opção');
    const colSituacao = findCol('Situação', 'Situacao', 'Status');
    const colDesconto = findCol('Desconto', 'Código');
    const colDataVenda = findCol('Data da Venda', 'Data Venda');
    const colHoraVenda = findCol('Hora da Venda', 'Hora Venda');
    const colCancelamento = findCol('Cancelamento');
    const colValidacao = findCol('Validação', 'Validacao');
    const colWhatsapp = findCol('Whatsapp', 'Telefone', 'Celular');
    const colLegendario = findCol('Legendário', 'Legendario');
    const colCidade = findCol('Cidade');
    const colEstado = findCol('Estado');

    const insert = db.prepare(`
      INSERT INTO participantes (id_ingresso, participante, comprador, email, opcao_ingresso, situacao, codigo_desconto, data_venda, hora_venda, data_cancelamento, data_validacao, whatsapp, legendario, cidade, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    const insertAll = db.transaction(() => {
      for (const row of rows) {
        const participante = colParticipante ? String(row[colParticipante]).trim() : '';
        if (!participante) continue;

        insert.run(
          colId ? String(row[colId]).trim() : null,
          participante,
          colComprador ? String(row[colComprador]).trim() : null,
          colEmail ? String(row[colEmail]).trim() : null,
          colIngresso ? String(row[colIngresso]).trim() : null,
          colSituacao ? String(row[colSituacao]).trim() : 'Confirmado',
          colDesconto ? String(row[colDesconto]).trim() : null,
          colDataVenda ? String(row[colDataVenda]).trim() : null,
          colHoraVenda ? String(row[colHoraVenda]).trim() : null,
          colCancelamento ? String(row[colCancelamento]).trim() : null,
          colValidacao ? String(row[colValidacao]).trim() : null,
          colWhatsapp ? String(row[colWhatsapp]).trim() : null,
          colLegendario ? String(row[colLegendario]).trim() : null,
          colCidade ? String(row[colCidade]).trim() : null,
          colEstado ? String(row[colEstado]).trim() : null,
        );
        count++;
      }
    });

    insertAll();
    return NextResponse.json({ imported: count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao processar arquivo' }, { status: 500 });
  }
}
