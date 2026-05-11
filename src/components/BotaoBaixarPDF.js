// BotaoBaixarPDF.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function BotaoBaixarPDF({ solicitacaoId, titulo }) {
  const [loading, setLoading] = useState(false);

  const handlePDF = async () => {
    setLoading(true);
    const id_projeto = localStorage.getItem("id_projeto");

    try {
      const url = `${api.defaults.baseURL}/pdf/solicitacoes/${solicitacaoId}?id_projeto=${id_projeto}&t=${Date.now()}`;

      const response = await fetch(url);
      const blob = await response.blob();

      const nomeArquivo = titulo
        ? `${titulo.replace(/\s+/g, "_")}.pdf`
        : `autorizacao_${solicitacaoId}.pdf`;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = nomeArquivo;
      link.click();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePDF}
      disabled={loading}
      className="btn-baixar-pdf"
      style={{
        backgroundColor: "#2196F3",
        color: "white",
        padding: "12px 24px",
        border: "none",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "8px",
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
          <span>Baixar PDF</span>
        </>
      )}
    </button>
  );
}