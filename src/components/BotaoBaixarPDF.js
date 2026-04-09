// components/BotaoBaixarPDF.jsx
import React, { useState } from 'react';

import api from '../services/api';

export default function BotaoBaixarPDF({ solicitacaoId }) {
  const [loading, setLoading] = useState(false);

  const handlePDF = () => {
    setLoading(true)
    const id_projeto = localStorage.getItem("id_projeto");

    const url = `${api.defaults.baseURL}/solicitacoes/${solicitacaoId}/pdf?id_projeto=${id_projeto}`;

    // 🔥 abre PDF (funciona no WebView)
    window.open(url, "_blank");
    setLoading(false)
  };

  return (
    <button
      onClick={handlePDF}
      disabled={loading}
      className="btn-baixar-pdf"
      style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <>
          <span>⏳</span>
          <span>Gerando PDF...</span>
        </>
      ) : (
        <>
          <span>⬇</span>
          <span>Abrir PDF</span>
        </>
      )}
    </button>
  );
}