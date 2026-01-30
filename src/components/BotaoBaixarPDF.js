// components/BotaoBaixarPDF.jsx
import React, { useState } from 'react';

import { gerarPDFSolicitacao } from '../utils/gerarPDFSolicitacao';
import api from '../services/api';

export default function BotaoBaixarPDF({ solicitacaoId }) {
  const [loading, setLoading] = useState(false);

  const handleBaixarPDF = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/solicitacoes/${solicitacaoId}/completa`);
      
      if (!response.data.success) {
        alert('Erro ao buscar dados da solicitação');
        return;
      }
      console.log(response.data)

      gerarPDFSolicitacao(response.data.data);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBaixarPDF}
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
        opacity: loading ? 0.6 : 1
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
          <span>Baixar PDF</span>
        </>
      )}
    </button>
  );
}