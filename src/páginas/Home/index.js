import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiDollarSign,
  FiLock,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../utils/roles";
import api from "../../services/api";

import "./style.css";
import Menu from "../Menu";

export default function Home() {
  const navigate = useNavigate();
  const vinculos = JSON.parse(localStorage.getItem("vinculo_professor") || "[]");
  const nome_professor = localStorage.getItem("nome_professor");
  const id_professor = localStorage.getItem("id_professor");

  const [projetos, setProjetos] = useState([]);

  const idProjetoAtual = Number(
    localStorage.getItem("id_projeto")
  );

  const vinculoAtual = vinculos.find(
    (v) => v.id_projeto === idProjetoAtual
  );

  const funcao_professor = vinculoAtual?.funcao || "";

  useEffect(() => {
    buscarProjetos();
  }, []);

  async function buscarProjetos() {
    try {
      const res = await api.get(`/professor/${id_professor}/projetos`);
      if (res.data.length > 1) {
        setProjetos(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function trocarProjeto(projeto) {
    localStorage.setItem("id_projeto", projeto.id);
    localStorage.setItem("nome_projeto", projeto.nome_projeto);
    window.location.reload();
  }

  function handleTurmas() { navigate("/turmas"); }
  function handleEstoque() { navigate("/estoque"); }
  function handleParticipantes() { navigate("/participantes"); }
  function handleSorteio() { navigate("/menu-sorteio"); }
  function handleAutorizacao() { navigate("/autorizacao"); }
  function handlePapagaios() { navigate("/loja"); }

  return (
    <>
      <Menu />
      <div className="container-home">
        <span className="welcome-text">
          Seja Bem-vindo, {nome_professor}
        </span>

        {/* ── SELETOR DE PROJETO ── */}
        {projetos.length > 1 && (
          <div className="projetos-container">
            <p>Selecione o projeto:</p>
            <div className="projetos-grid">
              {projetos.map((p) => (
                <div
                  key={p.id}
                  className={`projeto-card ${Number(localStorage.getItem("id_projeto")) === p.id
                      ? "ativo"
                      : ""
                    }`}
                  onClick={() => trocarProjeto(p)}
                >
                  <span>{p.nome_projeto}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MENU ── */}
        <div className="menu-grid">
          {isAdmin(funcao_professor) && (
            <div onClick={handleAutorizacao}>
              <span>Autorizações</span>
              <FiLock size={18} color="#f18140" />
            </div>
          )}

          <div onClick={handleTurmas}>
            <span>Frequência</span>
            <FiCalendar size={18} color="#f18140" />
          </div>

          <div onClick={handleParticipantes}>
            <span>Participantes</span>
            <FiUsers size={18} color="#f18140" />
          </div>

          <div onClick={handleEstoque}>
            <span>Registro de Consumo</span>
            <FiShoppingCart size={18} color="#f18140" />
          </div>

          <div onClick={handleSorteio}>
            <span>Sorteio</span>
            <FiPackage size={18} color="#f18140" />
          </div>

          <div onClick={handlePapagaios}>
            <span>Loja Papagaio</span>
            <FiDollarSign size={18} color="#f18140" />
          </div>
        </div>
      </div>
    </>
  );
}