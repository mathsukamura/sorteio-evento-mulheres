'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import WinnerModal from '@/components/WinnerModal';

const RouletteWheel = dynamic(() => import('@/components/RouletteWheel'), { ssr: false });

interface Participante { id: number; participante: string; whatsapp?: string; cidade?: string; estado?: string; situacao?: string; }
interface Sorteio { id: number; nome: string; whatsapp?: string; cidade?: string; estado?: string; created_at: string; }

export default function Home() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [spinCount, setSpinCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<Participante | null>(null);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [historico, setHistorico] = useState<Sorteio[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchParticipantes = useCallback(async () => {
    const res = await fetch('/api/participantes');
    setParticipantes(await res.json());
  }, []);

  const fetchHistorico = useCallback(async () => {
    const res = await fetch('/api/historico');
    setHistorico(await res.json());
  }, []);

  useEffect(() => { fetchParticipantes(); fetchHistorico(); }, [fetchParticipantes, fetchHistorico]);

  const confirmados = participantes.filter(p => p.situacao === 'Confirmado');

  const sortear = async () => {
    if (confirmados.length < 2 || isAnimating) return;
    const res = await fetch('/api/sortear', { method: 'POST' });
    if (!res.ok) return;
    const sorteada = await res.json();
    const idx = confirmados.findIndex((p) => p.id === sorteada.id);
    setWinnerIndex(idx >= 0 ? idx : 0);
    setWinner(sorteada);
    setIsAnimating(true);
    setSpinCount(prev => prev + 1);
  };

  const onSpinComplete = () => {
    setIsAnimating(false);
    setShowModal(true);
    fetchHistorico();
  };

  const limparHistorico = async () => {
    await fetch('/api/historico', { method: 'DELETE' }); fetchHistorico();
  };

  return (
    <main style={{
      height: '100vh', background: '#F8F4EF',
      fontFamily: "'Inter', sans-serif",
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>

      {/* Header fixo no topo */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontSize: 28, fontWeight: 900, color: '#2C1E14',
            letterSpacing: '-0.03em', margin: 0,
          }}>Sorteio Especial</h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700,
              color: '#8B6F47', background: 'rgba(200,168,126,0.12)',
              border: '1px solid rgba(200,168,126,0.2)', cursor: 'pointer',
              transition: 'all 0.3s ease', fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,168,126,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200,168,126,0.12)'; }}
          >
            Sorteadas ({historico.length})
          </button>
          <a
            href="/participantes"
            style={{
              padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700,
              color: '#fff', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #4A3125, #2C1E14)',
              boxShadow: '0 4px 15px rgba(61,43,31,0.12)',
              transition: 'all 0.3s ease', display: 'flex', alignItems: 'center',
            }}
          >
            Participantes ({confirmados.length})
          </a>
        </div>
      </div>

      {/* Globo 3D - preenche todo o espaço */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Suspense fallback={
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 24, height: 24, border: '2px solid rgba(200,168,126,0.3)', borderTopColor: '#C8A87E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        }>
          <RouletteWheel
            participantes={confirmados}
            spinCount={spinCount}
            onSpinComplete={onSpinComplete}
            winnerIndex={winnerIndex}
            fullscreen
          />
        </Suspense>
      </div>

      {/* Botao sortear fixo embaixo */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '24px 40px 36px', flexShrink: 0,
      }}>
        <button
          onClick={sortear}
          disabled={isAnimating || confirmados.length < 2}
          style={{
            padding: '22px 80px',
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: '#FDF6EE',
            background: isAnimating
              ? 'linear-gradient(135deg, #A68B6B, #8B6F47)'
              : 'linear-gradient(135deg, #4A3125, #2C1E14)',
            border: 'none',
            borderRadius: 18,
            cursor: isAnimating || confirmados.length < 2 ? 'not-allowed' : 'pointer',
            opacity: confirmados.length < 2 ? 0.3 : 1,
            boxShadow: '0 10px 40px rgba(61,43,31,0.22)',
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            if (confirmados.length >= 2 && !isAnimating) {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 18px 50px rgba(61,43,31,0.32)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(61,43,31,0.22)';
          }}
        >
          {isAnimating ? 'Girando...' : 'Sortear Agora'}
        </button>
      </div>

      {/* Painel de historico lateral */}
      {showHistory && (
        <div
          style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(200,168,126,0.18)',
            boxShadow: '-8px 0 40px rgba(60,40,20,0.08)',
            zIndex: 100, padding: '28px', overflowY: 'auto',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#2C1E14', margin: 0 }}>Sorteadas</h2>
            <button
              onClick={() => setShowHistory(false)}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                background: 'rgba(232,221,208,0.5)', cursor: 'pointer',
                fontSize: 16, color: '#8B6F47', fontFamily: "'Inter', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              X
            </button>
          </div>

          {historico.map((s, i) => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 14, marginBottom: 8,
              background: '#fff', border: '1px solid #EDE5DA',
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
                background: 'linear-gradient(135deg, #6B4C3B, #4A3125)',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#2C1E14', margin: 0 }}>{s.nome}</p>
                <p style={{ fontSize: 11, color: '#B8A08A', margin: '2px 0 0' }}>
                  {new Date(s.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}

          {historico.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#A68B6B', fontWeight: 500 }}>Nenhum sorteio</p>
            </div>
          )}

          {historico.length > 0 && (
            <button
              onClick={limparHistorico}
              style={{
                width: '100%', marginTop: 16, padding: '14px 0', borderRadius: 12,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                color: '#C8A87E', background: 'none',
                border: '1.5px solid #E8DDD0', transition: 'all 0.3s ease',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#C0392B'; e.currentTarget.style.borderColor = '#F5CCCC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#C8A87E'; e.currentTarget.style.borderColor = '#E8DDD0'; }}
            >
              Limpar historico
            </button>
          )}
        </div>
      )}

      <WinnerModal winner={showModal ? winner : null} onClose={() => setShowModal(false)} />

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
