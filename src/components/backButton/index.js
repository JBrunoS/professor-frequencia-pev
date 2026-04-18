import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function BackButton({ to, label = "Voltar", fallback = -1 }) {
  const navigate = useNavigate();

  function handleBack() {
    if (to) {
      navigate(to); // volta histórico
    } else {
      navigate(fallback); // rota fixa
    }
  }

  return (
    <button className="back-button" onClick={handleBack}>
      <FiArrowLeft size={18} />
      {label}
    </button>
  );
}