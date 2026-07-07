import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

import Menu from "../Menu";
import api from "../../services/api";
import "./style.css";
import BotaoBaixarPDF from "../../components/BotaoBaixarPDF";
import BackButton from "../../components/backButton";
import { toast } from "react-toastify";

export default function DetalheSolicitacao() {
  const { id } = useParams();

  const vinculos = JSON.parse(localStorage.getItem("vinculo_professor") || "[]");
  const id_projeto = localStorage.getItem("id_projeto");
  const vinculoAtual = vinculos.find(
    (v) => v.id_projeto === Number(id_projeto)
  );
  const role = vinculoAtual?.funcao || "";

  const [solicitacao, setSolicitacao] = useState(null);
  const [itens, setItens] = useState([]);
  const [timeline, setTimeline] = useState([]);


  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await api.get(`/solicitacoes/${id}/${id_projeto}`, {});
        setSolicitacao(res.data.solicitacao);
        setItens(res.data.itens);
        setTimeline(res.data.timeline);
      } catch (err) {
        console.error(err);
      }
    }

    carregarDados();
  }, [id]);

  // if (!solicitacao) return null;

  function renderStatus(status) {
    switch (status) {
      case "AGUARDANDO_COMITE":
        return (
          <span className="status aguardando">
            <FiClock /> Aguardando Comitê
          </span>
        );
      case "AGUARDANDO_PAGAMENTO":
        return (
          <span className="status aprovado">
            <FiClock /> Aguardando Pagamento
          </span>
        );
      case "AGUARDANDO_PRESIDENCIA":
        return (
          <span className="status pago">
            <FiCheckCircle /> Aguardando Presidência
          </span>
        );
      case "FINALIZADO":
        return (
          <span className="status finalizado">
            <FiCheckCircle /> Finalizado
          </span>
        );
      case "RECUSADO":
        return (
          <span className="status recusado">
            <FiXCircle /> Recusado
          </span>
        );
      default:
        return null;
    }
  }

  async function handleAprovacao({ status, observacao = null }) {
    try {
      const payload = {
        id_projeto,
        id_user: localStorage.getItem("id_professor"),
        solicitacao_id: id,
        etapa: solicitacao.etapa_atual,
        role,
        status,
        observacao,
        aprovado_por_nome: localStorage.getItem("nome_professor"),
      };

      await api.post("/aprovacoes", payload);

      // ✅ URL corrigida
      const res = await api.get(`/solicitacoes/${id}/${id_projeto}`);

      setSolicitacao(res.data.solicitacao);
      setItens(res.data.itens);
      setTimeline(res.data.timeline);

      toast.success("Aprovado com sucesso!");
    } catch (err) {
      console.error("Erro ao aprovar solicitação", err);
      toast.error("Erro ao processar a solicitação");
    }
  }

  if (!solicitacao) {
    return (
      <>
        <Menu />

        <div className="container-autorizacao">
          <BackButton />

          <div className="header-detalhe">
            <div className="skeleton skeleton-title" />
          </div>

          <div className="card">
            <div className="skeleton skeleton-big" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>

          <h3>Itens</h3>

          <div className="card item-card">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>

          <div className="card item-card">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>

          <div className="card total-card">
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />

      <div className="container-autorizacao">
        <BackButton />
        {/* HEADER */}
        <div className="header-detalhe">
          {/* <button onClick={() => navigate(-1)}>
            <FiArrowLeft size={25} />
          </button> */}
          <h2>Detalhes da Solicitação</h2>
        </div>

        {/* DADOS GERAIS */}
        {solicitacao && (
          <>
            <div className="card">
              <h3>{solicitacao.titulo}</h3>
              {renderStatus(solicitacao.status)}

              <span>
                <strong>Solicitação:</strong> {solicitacao.titulo}
              </span>
              <span>
                <strong>Descrição:</strong> {solicitacao.descricao}
              </span>
              <span>
                <strong>Atividade:</strong> {solicitacao.atividade_nome}
              </span>
              <span>
                <strong>Área:</strong>{" "}
                {String(solicitacao.atividade_area).toLocaleUpperCase()}
              </span>
              <span>
                <strong>Custo: R$</strong>{" "}
                {Number(solicitacao.atividade_custo).toFixed(2)}
              </span>
              <span>
                <strong>Local de compra:</strong> {solicitacao.local_compra}
              </span>
              <span>
                <strong>Prazo:</strong>{" "}
                {new Date(solicitacao.data_prazo).toLocaleDateString()}
              </span>
            </div>

            {/* ITENS */}
            <h3>Itens</h3>
            {itens.map((item) => (
              <div className="card item-card" key={item.id}>
                <strong>{item.descricao}</strong>
                <span>
                  {item.quantidade} x R${" "}
                  {Number(item.valor_unitario).toFixed(2)}
                </span>
                <span>Total: R$ {Number(item.valor_total).toFixed(2)}</span>
              </div>
            ))}

            {/* TOTAL */}
            <div className="card total-card">
              <strong>Valor Total</strong>
              <span>R$ {Number(solicitacao.valor_total).toFixed(2)}</span>
            </div>

            {/* TIMELINE */}
            <h3>Histórico</h3>
            <div className="timeline">
              {timeline.map((t) => {
                // Define a cor baseada no status
                let dotClass = "dot"; // verde padrão

                if (
                  t.acao === "RECUSADO" ||
                  t.aprovacao_status === "RECUSADO"
                ) {
                  dotClass = "dot recusado";
                } else if (t.aprovacao_status === "APROVADO") {
                  dotClass = "dot aprovado";
                } else if (t.aprovacao_status === "PENDENTE") {
                  dotClass = "dot pendente";
                }

                return (
                  <div className="timeline-item" key={t.id}>
                    <div className={dotClass} />
                    <div className="content">
                      <strong>{t.etapa}</strong>
                      <span>{t.acao}</span>
                      <small>
                        {t.usuario_nome} •{" "}
                        {new Date(t.data_hora).toLocaleString()}
                      </small>
                      {t.aprovacao_observacao && (
                        <small
                          style={{ fontStyle: "italic", color: "#f59f2eff" }}
                        >
                          {t.aprovacao_observacao}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}

              {timeline.length === 0 && (
                <span className="empty">Nenhum histórico disponível</span>
              )}
            </div>

            {/* AÇÕES DO COMITÊ */}
            {role === "Comitê" &&
              solicitacao.status === "AGUARDANDO_COMITE" && (
                <div className="acoes">
                  <button
                    className="aprovar"
                    onClick={() => handleAprovacao({ status: "APROVADO" })}
                  >
                    Aprovar
                  </button>
                  <button
                    className="recusar"
                    onClick={() => {
                      const obs = prompt("Digite a observação:");
                      if (obs) {
                        handleAprovacao({
                          status: "RECUSADO",
                          observacao: obs,
                        });
                      }
                    }}
                  >
                    Recusar
                  </button>
                  <button
                    className="observacao"
                    onClick={() => {
                      const obs = prompt("Digite a observação:");
                      if (obs) {
                        handleAprovacao({
                          status: "APROVADO",
                          observacao: obs,
                        });
                      }
                    }}
                  >
                    Aprovar com Observações
                  </button>
                </div>
              )}
            {role === "Financeiro(a)" &&
              solicitacao.status === "APROVADO_COMITE" && (
                <div className="acoes">
                  <button
                    className="aprovar"
                    // style={{ width: "100%", marginBlock: 20, fontSize: 15 }}
                    onClick={() => handleAprovacao({ status: "APROVADO" })}
                  >
                    Fazer Pagamento
                  </button>
                  <button
                    className="recusar"
                    onClick={() => {
                      const obs = prompt("Digite a observação:");
                      if (obs) {
                        handleAprovacao({
                          status: "RECUSADO",
                          observacao: obs,
                        });
                      }
                    }}
                  >
                    Recusar
                  </button>
                </div>
              )}
            {role === "Presidente" &&
              solicitacao.status === "AGUARDANDO_PRESIDENCIA" && (
                <div className="acoes">
                  <button
                    className="aprovar"
                    // style={{ width: "100%", marginBlock: 20, fontSize: 15 }}
                    onClick={() => handleAprovacao({ status: "APROVADO" })}
                  >
                    Dar ciência/Encerrar
                  </button>
                  <button
                    className="recusar"
                    // style={{ width: "100%", marginBlock: 20, fontSize: 15 }}
                    onClick={() => {
                      const obs = prompt("Digite a observação:");
                      if (obs) {
                        handleAprovacao({
                          status: "RECUSADO",
                          observacao: obs,
                        });
                      }
                    }}
                  >
                    Recusar
                  </button>
                </div>
              )}
            {(solicitacao.status === "FINALIZADO" ||
              solicitacao.status === "RECUSADO") && (
              <BotaoBaixarPDF solicitacaoId={solicitacao.id} titulo={solicitacao.titulo} />
            )}
          </>
        )}
      </div>
    </>
  );
}
