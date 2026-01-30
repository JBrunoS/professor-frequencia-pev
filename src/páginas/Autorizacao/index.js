import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
} from "react-icons/fi";

import api from "../../services/api";
import Menu from "../Menu";
import "./style.css";

const STATUS = {
  AGUARDANDO_COMITE: "AGUARDANDO_COMITE",
  APROVADO_COMITE: "APROVADO_COMITE",
  AGUARDANDO_PRESIDENCIA: "AGUARDANDO_PRESIDENCIA",
  FINALIZADO: "FINALIZADO",
  RECUSADO: "RECUSADO",
};

const STATUS_MAP = {
  AGUARDANDO_COMITE: {
    class: "aguardando",
    icon: <FiClock />,
    label: "Aguardando Comitê",
  },
  APROVADO_COMITE: {
    class: "aprovado",
    icon: <FiCheckCircle />,
    label: "Aguardando Pagamento",
  },
  AGUARDANDO_PRESIDENCIA: {
    class: "pago",
    icon: <FiCheckCircle />,
    label: "Aguardando Presidência",
  },
  FINALIZADO: {
    class: "finalizado",
    icon: <FiCheckCircle />,
    label: "Finalizado",
  },
  RECUSADO: {
    class: "recusado",
    icon: <FiXCircle />,
    label: "Recusado",
  },
};

export default function Autorizacao() {
  const [tab, setTab] = useState("solicitacoes");
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const role = localStorage.getItem("funcao_professor");
  const id_projeto = localStorage.getItem("id_projeto");

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      setLoading(true);
      const response = await api.get("/solicitacoes", {
        params: {
          id_projeto
        },
      });
      setEventos(response.data);
    } catch (error) {
      alert("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }

  const filtros = {
    solicitacoes: (e) => e.status === STATUS.RECUSADO || e.status === STATUS.FINALIZADO,
    comite: (e) => e.status === STATUS.AGUARDANDO_COMITE,
    financeiro: (e) => e.status === STATUS.APROVADO_COMITE,
    presidencia: (e) => e.status === STATUS.AGUARDANDO_PRESIDENCIA,
  };

  const eventosFiltrados = eventos.filter(filtros[tab]);

  const contadores = {
    solicitacoes: eventos.filter(filtros.solicitacoes).length,
    comite: eventos.filter(filtros.comite).length,
    financeiro: eventos.filter(filtros.financeiro).length,
    presidencia: eventos.filter(filtros.presidencia).length,
  };

  function renderStatus(status) {
    const s = STATUS_MAP[status];
    if (!s) return null;

    return (
      <span className={`status ${s.class}`}>
        {s.icon}
        {s.label}
      </span>
    );
  }

  return (
    <>
      <Menu />

      <div className="container-autorizacao">
        <div className="header-autorizacao">
          <h2>Autorizações</h2>

          {(role === "Diretor(a)" || role === "Coordenador(a)") && (
            <button
              className="download"
              onClick={() => navigate("/autorizacao/nova")}
            >
              <FiPlus />
              Criar
            </button>
          )}
        </div>

        {/* ===== ABAS ===== */}
        <div className="tabs-autorizacao">
          <button
            onClick={() => setTab("solicitacoes")}
            className={tab === "solicitacoes" ? "active" : ""}
          >
            Solicitações ({contadores.solicitacoes})
          </button>

          <button
            onClick={() => setTab("comite")}
            className={tab === "comite" ? "active" : ""}
          >
            Comitê Fin. ({contadores.comite})
          </button>

          <button
            onClick={() => setTab("financeiro")}
            className={tab === "financeiro" ? "active" : ""}
          >
            Financeiro ({contadores.financeiro})
          </button>

          <button
            onClick={() => setTab("presidencia")}
            className={tab === "presidencia" ? "active" : ""}
          >
            Presidência ({contadores.presidencia})
          </button>
        </div>

        {/* ===== LISTA ===== */}
        {loading && <p className="loading">Carregando...</p>}

        {!loading && eventosFiltrados.length === 0 && (
          <p className="empty">Nenhuma solicitação encontrada</p>
        )}

        {!loading &&
          eventosFiltrados.map((e) => (
            <div
              key={e.id}
              className="card-autorizacao"
              onClick={() => navigate(`/autorizacao/${e.id}`)}
            >
              <h3>{e.titulo}</h3>
              {renderStatus(e.status)}
            </div>
          ))}
      </div>
    </>
  );
}
