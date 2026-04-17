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

import "./style.css";

import Menu from "../Menu";

export default function Home() {
  const navigate = useNavigate();
  const funcao_professor = localStorage.getItem("funcao_professor") || "";
  const nome_professor = localStorage.getItem("nome_professor");

  function handleTurmas() {
    navigate("/turmas");
  }
  function handleEstoque() {
    navigate("/estoque");
  }
  function handleParticipantes() {
    navigate("/participantes");
  }
  function handleSorteio() {
    navigate("/menu-sorteio");
  }
  function handleAutorizacao() {
    navigate("/autorizacao");
  }
  function handlePapagaios() {
    navigate("/loja");
  }

  return (
    <>
      <Menu />
      <div className="container-home">
        <span className="welcome-text">
          Seja Bem-vindo, {nome_professor}
        </span>

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
