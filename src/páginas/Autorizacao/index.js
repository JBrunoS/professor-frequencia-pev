import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";

import api from "../../services/api";
import Menu from "../Menu";
import "./style.css";
import BackButton from "../../components/backButton";
import { toast } from "react-toastify";

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

const MESES = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function Autorizacao() {
  const [tab, setTab] = useState("solicitacoes");
  const [atividades, setAtividades] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null);

  const navigate = useNavigate();

  const vinculos = JSON.parse(localStorage.getItem("vinculo_professor") || "[]");
  const id_projeto = localStorage.getItem("id_projeto");
  const vinculoAtual = vinculos.find(
    (v) => v.id_projeto === Number(id_projeto)
  );
  const role = vinculoAtual?.funcao || "";

  useEffect(() => {
    carregarSolicitacoes();
  }, [id_projeto]);

  async function carregarSolicitacoes() {
    try {
      setLoading(true);

      const response = await api.get("/solicitacoes", {
        params: { id_projeto },
      });

      setAtividades(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }

  const filtros = {
    solicitacoes: (e) =>
      e.status === STATUS.RECUSADO || e.status === STATUS.FINALIZADO,
    comite: (e) => e.status === STATUS.AGUARDANDO_COMITE,
    financeiro: (e) => e.status === STATUS.APROVADO_COMITE,
    presidencia: (e) => e.status === STATUS.AGUARDANDO_PRESIDENCIA,
  };

  function filtrar(lista) {
    return lista.filter(filtros[tab]);
  }

  // 🔥 PERIODOS DISPONÍVEIS (MÊS + ANO)
  const periodosDisponiveis = Array.from(
    new Set(atividades.map((a) => `${a.mes_realizacao}-${a.ano_realizacao}`)),
  )
    .map((p) => {
      const [mes, ano] = p.split("-").map(Number);
      return { mes, ano };
    })
    .sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

  // 🔥 DEFINE MÊS/ANO AUTOMÁTICO
  useEffect(() => {
    if (periodosDisponiveis.length > 0) {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();

      const encontrado = periodosDisponiveis.find(
        (p) => p.mes === mesAtual && p.ano === anoAtual,
      );

      if (encontrado) {
        setPeriodoSelecionado(encontrado);
      } else {
        setPeriodoSelecionado(periodosDisponiveis[0]);
      }
    }
  }, [atividades]);

  // 🔥 FILTRO POR PERÍODO
  const atividadesFiltradas =
    tab === "solicitacoes"
      ? atividades.filter((a) => {
        if (!periodoSelecionado) return true;

        return (
          a.mes_realizacao === periodoSelecionado.mes &&
          a.ano_realizacao === periodoSelecionado.ano
        );
      })
      : atividades;

  // CONTADORES
  const contadores = {
    solicitacoes: atividades.reduce(
      (acc, a) => acc + a.solicitacoes.filter(filtros.solicitacoes).length,
      0,
    ),
    comite: atividades.reduce(
      (acc, a) => acc + a.solicitacoes.filter(filtros.comite).length,
      0,
    ),
    financeiro: atividades.reduce(
      (acc, a) => acc + a.solicitacoes.filter(filtros.financeiro).length,
      0,
    ),
    presidencia: atividades.reduce(
      (acc, a) => acc + a.solicitacoes.filter(filtros.presidencia).length,
      0,
    ),
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

  function toggle(id) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <>
      <Menu />

      <div className="container-autorizacao">
        <BackButton to="/" label="Voltar para Home" />
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

        {/* ABAS */}
        <div className="tabs-autorizacao">
          <button
            onClick={() => setTab("solicitacoes")}
            className={tab === "solicitacoes" ? "active" : ""}
          >
            Solicit. ({contadores.solicitacoes})
          </button>

          <button
            onClick={() => setTab("comite")}
            className={tab === "comite" ? "active" : ""}
          >
            Comitê ({contadores.comite})
          </button>

          <button
            onClick={() => setTab("financeiro")}
            className={tab === "financeiro" ? "active" : ""}
          >
            Financ. ({contadores.financeiro})
          </button>

          <button
            onClick={() => setTab("presidencia")}
            className={tab === "presidencia" ? "active" : ""}
          >
            Presid. ({contadores.presidencia})
          </button>
        </div>

        {/* SELECT MÊS/ANO */}
        {tab === "solicitacoes" && (
          <div style={{ margin: "10px 0" }}>
            <select
              value={
                periodoSelecionado
                  ? `${periodoSelecionado.mes}-${periodoSelecionado.ano}`
                  : ""
              }
              onChange={(e) => {
                const [mes, ano] = e.target.value.split("-").map(Number);
                setPeriodoSelecionado({ mes, ano });
              }}
            >
              {periodosDisponiveis.map((p) => {
                const mesLabel =
                  MESES.find((m) => m.value === p.mes)?.label || p.mes;

                return (
                  <option key={`${p.mes}-${p.ano}`} value={`${p.mes}-${p.ano}`}>
                    {mesLabel}/{p.ano}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* LISTA */}
        {loading && <p className="loading">Carregando...</p>}

        {!loading &&
          atividadesFiltradas.map((atividade) => {
            const solicitacoesFiltradas = filtrar(atividade.solicitacoes);

            if (solicitacoesFiltradas.length === 0) return null;

            return (
              <div key={atividade.atividade_id} className="accordion">
                <div
                  className="card-autorizacao"
                  onClick={() => toggle(atividade.atividade_id)}
                >
                  <h3>{atividade.nome}</h3>
                  <p>{atividade.area}</p>
                  <span>{solicitacoesFiltradas.length} solicitações</span>

                  <p>
                    🟡{" "}
                    {
                      atividade.solicitacoes.filter(
                        (s) =>
                          s.status === STATUS.AGUARDANDO_COMITE ||
                          s.status === STATUS.APROVADO_COMITE ||
                          s.status === STATUS.AGUARDANDO_PRESIDENCIA,
                      ).length
                    }
                    {" | "}
                    🟢{" "}
                    {
                      atividade.solicitacoes.filter(
                        (s) => s.status === STATUS.FINALIZADO,
                      ).length
                    }
                    {" | "}
                    🔴{" "}
                    {
                      atividade.solicitacoes.filter(
                        (s) => s.status === STATUS.RECUSADO,
                      ).length
                    }
                  </p>
                </div>

                {expanded[atividade.atividade_id] && (
                  <div className="accordion-content">
                    {solicitacoesFiltradas.map((e) => (
                      <div
                        key={e.id}
                        className="card-autorizacao child"
                        onClick={() => navigate(`/autorizacao/${e.id}`)}
                      >
                        <h4>{e.titulo}</h4>
                        {renderStatus(e.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {!loading && contadores[tab] === 0 && (
          <p className="empty">Nenhuma solicitação encontrada</p>
        )}
      </div>
    </>
  );
}
