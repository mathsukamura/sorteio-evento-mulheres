'use client';

import { useState, useEffect, useCallback } from 'react';

interface Participante {
  id: number;
  id_ingresso: string;
  participante: string;
  comprador: string;
  email: string;
  opcao_ingresso: string;
  situacao: string;
  whatsapp: string;
  cidade: string;
  estado: string;
}

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [tab, setTab] = useState<'lista' | 'importar' | 'manual'>('lista');
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState('');
  const [filtro, setFiltro] = useState('');

  // Manual form
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const fetchAll = useCallback(async () => {
    const res = await fetch('/api/participantes');
    setParticipantes(await res.json());
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addManual = async () => {
    if (!nome.trim()) return;
    await fetch('/api/participantes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participante: nome, whatsapp, cidade, estado, situacao: 'Confirmado' }),
    });
    setNome(''); setWhatsapp(''); setCidade(''); setEstado('');
    fetchAll();
  };

  const remove = async (id: number) => {
    await fetch('/api/participantes', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchAll();
  };

  const deleteAll = async () => {
    if (!confirm('Tem certeza? Isso vai apagar TODAS as participantes e o historico de sorteios.')) return;
    await fetch('/api/participantes', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteAll: true }),
    });
    fetchAll();
  };

  const importar = async () => {
    if (!importText.trim()) return;
    setImporting(true);
    setImportResult('');

    try {
      const lines = importText.trim().split('\n');
      // Pular header se existir
      const startIdx = lines[0].includes('Participante') || lines[0].includes('ID') ? 1 : 0;
      const rows = [];

      for (let i = startIdx; i < lines.length; i++) {
        const cols = lines[i].split('\t');
        if (cols.length < 5) continue;

        rows.push({
          id_ingresso: cols[0]?.trim() || '',
          participante: cols[1]?.trim() || '',
          comprador: cols[2]?.trim() || '',
          email: cols[3]?.trim() || '',
          opcao_ingresso: cols[4]?.trim() || '',
          situacao: cols[5]?.trim() || 'Confirmado',
          codigo_desconto: cols[6]?.trim() || '',
          data_venda: cols[7]?.trim() || '',
          hora_venda: cols[8]?.trim() || '',
          data_cancelamento: cols[9]?.trim() || '',
          data_validacao: cols[10]?.trim() || '',
          whatsapp: cols[11]?.trim() || '',
          legendario: cols[12]?.trim() || '',
          cidade: cols[13]?.trim() || '',
          estado: cols[14]?.trim() || '',
        });
      }

      if (rows.length === 0) {
        setImportResult('Nenhuma linha valida encontrada');
        setImporting(false);
        return;
      }

      const res = await fetch('/api/participantes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      const data = await res.json();
      setImportResult(`${data.imported} participantes importadas com sucesso!`);
      setImportText('');
      fetchAll();
    } catch {
      setImportResult('Erro ao importar. Verifique o formato dos dados.');
    }
    setImporting(false);
  };

  const confirmados = participantes.filter(p => p.situacao === 'Confirmado');
  const cancelados = participantes.filter(p => p.situacao === 'Cancelado');
  const pendentes = participantes.filter(p => p.situacao === 'Pendente');

  const filtered = participantes.filter(p =>
    !filtro || p.participante?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.whatsapp?.includes(filtro) || p.cidade?.toLowerCase().includes(filtro.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', borderRadius: 12,
    fontSize: 14, fontWeight: 500, color: '#2C1E14',
    background: '#fff', border: '2px solid #E8DDD0',
    outline: 'none', transition: 'border 0.3s ease',
    boxShadow: '0 2px 8px rgba(60,40,20,0.03)',
    fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' as const,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    color: '#8B6F47', marginBottom: 6, paddingLeft: 2,
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F8F4EF', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#B8A08A', fontWeight: 500, marginBottom: 4 }}>Gerenciar</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2C1E14', letterSpacing: '-0.03em', margin: 0 }}>Participantes</h1>
          </div>
          <a href="/" style={{
            padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700,
            color: '#fff', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #4A3125, #2C1E14)',
            boxShadow: '0 4px 15px rgba(61,43,31,0.12)',
          }}>
            Ir para Sorteio
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total', value: participantes.length, color: '#2C1E14' },
            { label: 'Confirmados', value: confirmados.length, color: '#27AE60' },
            { label: 'Pendentes', value: pendentes.length, color: '#E67E22' },
            { label: 'Cancelados', value: cancelados.length, color: '#C0392B' },
          ].map((s) => (
            <div key={s.label} style={{
              padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(200,168,126,0.15)',
            }}>
              <p style={{ fontSize: 24, fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#A68B6B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(232,221,208,0.45)', marginBottom: 24 }}>
          {(['lista', 'importar', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#2C1E14' : '#A68B6B',
                boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {t === 'lista' ? 'Lista' : t === 'importar' ? 'Importar Dados' : 'Adicionar Manual'}
            </button>
          ))}
        </div>

        {/* TAB: IMPORTAR */}
        {tab === 'importar' && (
          <div style={{
            borderRadius: 20, padding: 28, background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(200,168,126,0.18)', boxShadow: '0 8px 35px rgba(60,40,20,0.05)',
          }}>
            <p style={{ fontSize: 14, color: '#5C3D2E', fontWeight: 600, marginBottom: 4 }}>
              Cole os dados da planilha aqui
            </p>
            <p style={{ fontSize: 12, color: '#A68B6B', marginBottom: 16 }}>
              Copie as linhas da sua planilha (com ou sem cabecalho) e cole no campo abaixo. Os dados devem estar separados por TAB.
            </p>
            <textarea
              placeholder="Cole aqui os dados copiados da planilha..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              style={{
                width: '100%', height: 220, padding: '16px 18px', borderRadius: 14,
                fontSize: 12, fontFamily: 'monospace', color: '#2C1E14',
                background: '#FDFAF6', border: '2px solid #E8DDD0', outline: 'none',
                resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={importar}
                disabled={importing || !importText.trim()}
                style={{
                  flex: 1, padding: '16px 0', borderRadius: 14, fontSize: 14, fontWeight: 800,
                  cursor: importing ? 'not-allowed' : 'pointer', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#fff', border: 'none',
                  background: 'linear-gradient(135deg, #27AE60, #1E8449)',
                  boxShadow: '0 6px 20px rgba(39,174,96,0.18)',
                  fontFamily: "'Inter', sans-serif", opacity: !importText.trim() ? 0.4 : 1,
                }}
              >
                {importing ? 'Importando...' : 'Importar Participantes'}
              </button>
            </div>
            {importResult && (
              <p style={{
                marginTop: 14, fontSize: 13, fontWeight: 600, textAlign: 'center',
                color: importResult.includes('sucesso') ? '#27AE60' : '#C0392B',
              }}>{importResult}</p>
            )}
          </div>
        )}

        {/* TAB: MANUAL */}
        {tab === 'manual' && (
          <div style={{
            borderRadius: 20, padding: 28, background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(200,168,126,0.18)', boxShadow: '0 8px 35px rgba(60,40,20,0.05)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nome da participante *</label>
                <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A87E'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8DDD0'} />
              </div>
              <div>
                <label style={labelStyle}>Whatsapp</label>
                <input type="text" placeholder="(99) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A87E'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8DDD0'} />
              </div>
              <div>
                <label style={labelStyle}>Cidade</label>
                <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A87E'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8DDD0'} />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <input type="text" placeholder="UF" value={estado} onChange={(e) => setEstado(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#C8A87E'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E8DDD0'} />
              </div>
            </div>
            <button onClick={addManual} style={{
              width: '100%', padding: '16px 0', borderRadius: 14, fontSize: 14, fontWeight: 800,
              cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#fff', border: 'none',
              background: 'linear-gradient(135deg, #8B6F47, #6B4C3B)',
              boxShadow: '0 6px 20px rgba(107,76,59,0.18)',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              + Adicionar Participante
            </button>
          </div>
        )}

        {/* TAB: LISTA */}
        {tab === 'lista' && (
          <div>
            {/* Search + actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Buscar por nome, whatsapp ou cidade..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#C8A87E'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E8DDD0'}
              />
              {participantes.length > 0 && (
                <button onClick={deleteAll} style={{
                  padding: '0 20px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                  color: '#C0392B', background: 'rgba(192,57,43,0.06)',
                  border: '1px solid rgba(192,57,43,0.15)', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                }}>
                  Apagar Tudo
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{
              borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(200,168,126,0.18)',
              background: '#fff',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F5EDE3' }}>
                      {['#', 'Participante', 'Whatsapp', 'Cidade/UF', 'Situacao', ''].map((h) => (
                        <th key={h} style={{
                          padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8B6F47',
                          borderBottom: '1px solid #E8DDD0',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F0E8DE' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FDFAF6'; const b = e.currentTarget.querySelector('button'); if (b) (b as HTMLElement).style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ''; const b = e.currentTarget.querySelector('button'); if (b) (b as HTMLElement).style.opacity = '0'; }}
                      >
                        <td style={{ padding: '10px 14px', color: '#B8A08A', fontWeight: 600, fontSize: 11 }}>{i + 1}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#2C1E14' }}>{p.participante}</td>
                        <td style={{ padding: '10px 14px', color: '#6B4C3B', fontSize: 12 }}>{p.whatsapp || '-'}</td>
                        <td style={{ padding: '10px 14px', color: '#8B6F47', fontSize: 12 }}>{[p.cidade, p.estado].filter(Boolean).join('/') || '-'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: p.situacao === 'Confirmado' ? 'rgba(39,174,96,0.1)' : p.situacao === 'Pendente' ? 'rgba(230,126,34,0.1)' : 'rgba(192,57,43,0.1)',
                            color: p.situacao === 'Confirmado' ? '#27AE60' : p.situacao === 'Pendente' ? '#E67E22' : '#C0392B',
                          }}>{p.situacao}</span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <button onClick={() => remove(p.id)} style={{
                            fontSize: 11, fontWeight: 700, color: '#D4B896', background: 'none',
                            border: 'none', cursor: 'pointer', opacity: 0, transition: 'all 0.3s ease',
                            fontFamily: "'Inter', sans-serif",
                          }}>Remover</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: '#A68B6B' }}>Nenhuma participante encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
