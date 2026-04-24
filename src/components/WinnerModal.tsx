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
        background: 'rgba(20, 12, 5, 0.75)',
        backdropFilter: 'blur(16px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 36,
          padding: '80px 60px',
          textAlign: 'center',
          width: '90vw',
          maxWidth: 900,
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 40px 120px rgba(40, 25, 12, 0.35)',
          border: '1px solid rgba(200, 168, 126, 0.15)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(30px)',
          opacity: visible ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Label */}
        <p style={{
          fontSize: 18, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.5em', color: '#A68B6B', marginBottom: 40,
        }}>
          A sorteada e
        </p>

        {/* Nome */}
        <h2 style={{
          fontSize: 72, fontWeight: 900, color: '#2C1E14',
          letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px',
          maxWidth: '90%', wordBreak: 'break-word',
        }}>
          {winner.participante || winner.nome}
        </h2>

        {/* Whatsapp */}
        {winner.whatsapp && (
          <p style={{ fontSize: 28, color: '#8B6F47', fontWeight: 500, margin: '0 0 8px' }}>
            {winner.whatsapp}
          </p>
        )}

        {/* Cidade */}
        {(winner.cidade || winner.estado) && (
          <p style={{ fontSize: 24, color: '#B8A08A', fontWeight: 400, margin: '0' }}>
            {[winner.cidade, winner.estado].filter(Boolean).join(' - ')}
          </p>
        )}

        {/* Linha */}
        <div style={{
          width: 100, height: 3, margin: '50px auto',
          background: 'linear-gradient(90deg, transparent, #C8A87E, transparent)',
        }} />

        {/* Botao fechar */}
        <button
          onClick={onClose}
          style={{
            padding: '22px 70px',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(135deg, #4A3125, #2C1E14)',
            border: 'none',
            borderRadius: 18,
            cursor: 'pointer',
            boxShadow: '0 10px 35px rgba(61, 43, 31, 0.2)',
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 18px 50px rgba(61,43,31,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 35px rgba(61,43,31,0.2)';
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
