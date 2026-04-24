'use client';

import { useEffect, useState } from 'react';

interface WinnerModalProps {
  winner: { participante?: string; nome?: string; whatsapp?: string; cidade?: string; estado?: string } | null;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (winner) {
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(26, 16, 8, 0.55)',
        backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 28,
          padding: '56px 52px',
          textAlign: 'center',
          minWidth: 380,
          maxWidth: 440,
          boxShadow: '0 30px 80px rgba(40, 25, 12, 0.25)',
          border: '1px solid rgba(200, 168, 126, 0.2)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Label */}
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.4em', color: '#A68B6B', marginBottom: 28,
        }}>
          A sorteada e
        </p>

        {/* Nome */}
        <h2 style={{
          fontSize: 32, fontWeight: 900, color: '#2C1E14',
          letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 8px',
        }}>
          {winner.participante || winner.nome}
        </h2>

        {/* Whatsapp */}
        {winner.whatsapp && (
          <p style={{ fontSize: 14, color: '#A68B6B', fontWeight: 400, margin: '0 0 0' }}>
            {winner.whatsapp}
          </p>
        )}
        {/* Cidade */}
        {(winner.cidade || winner.estado) && (
          <p style={{ fontSize: 13, color: '#B8A08A', fontWeight: 400, margin: '4px 0 0' }}>
            {[winner.cidade, winner.estado].filter(Boolean).join(' - ')}
          </p>
        )}

        {/* Linha */}
        <div style={{
          width: 48, height: 2, margin: '32px auto',
          background: 'linear-gradient(90deg, transparent, #C8A87E, transparent)',
        }} />

        {/* Botao fechar */}
        <button
          onClick={onClose}
          style={{
            padding: '16px 48px',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(135deg, #4A3125, #2C1E14)',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(61, 43, 31, 0.18)',
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 14px 35px rgba(61,43,31,0.28)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(61,43,31,0.18)';
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
