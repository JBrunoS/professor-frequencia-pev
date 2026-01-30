import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash } from "react-icons/fi";
import api from "../../services/api";

import Menu from "../Menu";
import "./style.css";

export default function CriarSolicitacao() {
  const navigate = useNavigate();
  const id_projeto = localStorage.getItem("id_projeto");
  const id_user = localStorage.getItem("id_professor");
  const criado_por_role = localStorage.getItem("funcao_professor");
  const nome_professor = localStorage.getItem("nome_professor");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [atividadeId, setAtividadeId] = useState("");
  const [atividades, setAtividades] = useState([]);
  const [dataPrazo, setDataPrazo] = useState("");
  const [localCompra, setLocalCompra] = useState("");

  // 👉 ITEM EM EDIÇÃO
  const [itemAtual, setItemAtual] = useState({
    descricao: "",
    valor_unitario: "",
    quantidade: 1,
    total: 0,
  });

  // 👉 LISTA DE ITENS
  const [itens, setItens] = useState([]);

  // 🔧 MOCK ATIVIDADES
  useEffect(() => {
    console.log(id_user);
    console.log(id_projeto);
    setAtividades([
      { id: 1, nome: "Oficina de Música" },
      { id: 2, nome: "Evento Cultural" },
      { id: 3, nome: "Projeto Pedagógico" },
    ]);
  }, []);

  function handleItemAtualChange(field, value) {
    const novoItem = { ...itemAtual, [field]: value };

    if (field === "valor_unitario" || field === "quantidade") {
      novoItem.total =
        Number(novoItem.valor_unitario) * Number(novoItem.quantidade) || 0;
    }

    setItemAtual(novoItem);
  }

  function adicionarItem() {
    if (!itemAtual.descricao || !itemAtual.valor_unitario) return;

    setItens([...itens, itemAtual]);

    setItemAtual({
      descricao: "",
      valor_unitario: "",
      quantidade: 1,
      total: 0,
    });
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  const valorTotal = itens.reduce((acc, item) => acc + item.total, 0);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1️⃣ cria solicitação
      const response = await api.post("/solicitacoes", {
        id_projeto,
        id_user,
        titulo,
        descricao,
        atividade_id: atividadeId,
        valor_total: valorTotal,
        local_compra: localCompra,
        data_prazo: dataPrazo,
        criado_por_role,
      });

      const solicitacaoId = response.data.id;

      // 2️⃣ cria itens
      await api.post(`/solicitacao/${solicitacaoId}/itens`, {
        itens: itens.map((i) => ({
          id_projeto: id_projeto,
          descricao: i.descricao,
          valor_unitario: Number(i.valor_unitario),
          quantidade: Number(i.quantidade),
        })),
      });

      await api.post(`timeline`, {
        id_projeto: id_projeto,
        solicitacao_id: solicitacaoId,
        nome_professor,
        criado_por_role,
      });

      navigate("/autorizacao");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar solicitação");
    }
  }

  return (
    <>
      <Menu />

      <div className="container-autorizacao">
        <h2>Criar Solicitação</h2>

        <form onSubmit={handleSubmit}>
          {/* ===== DADOS GERAIS ===== */}
          <div className="card">
            <label>Atividade</label>
            <select
              value={atividadeId}
              onChange={(e) => setAtividadeId(e.target.value)}
              required
            >
              <option value="">Selecione uma atividade</option>
              {atividades.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>

            <label>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <label>Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />

            {/* ➕ NOVOS CAMPOS */}
            <label>Data Prazo</label>
            <input
              type="date"
              value={dataPrazo}
              onChange={(e) => setDataPrazo(e.target.value)}
              required
            />

            <label>Local de Compra</label>
            <input
              type="text"
              placeholder="Ex: Loja X, Mercado Y"
              value={localCompra}
              onChange={(e) => setLocalCompra(e.target.value)}
            />
          </div>

          {/* ===== ITEM ===== */}
          <h3>Adicionar Item</h3>

          <div className="card item-card">
            <input
              type="text"
              placeholder="Descrição do item"
              value={itemAtual.descricao}
              onChange={(e) =>
                handleItemAtualChange("descricao", e.target.value)
              }
            />

            <div className="row">
              <input
                type="number"
                placeholder="Valor unitário"
                value={itemAtual.valor_unitario}
                onChange={(e) =>
                  handleItemAtualChange("valor_unitario", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Qtd"
                value={itemAtual.quantidade}
                onChange={(e) =>
                  handleItemAtualChange("quantidade", e.target.value)
                }
              />
            </div>

            <span className="total-item">
              Total: R$ {itemAtual.total.toFixed(2)}
            </span>

            <button type="button" className="btn-add" onClick={adicionarItem}>
              <FiPlus /> Adicionar Item
            </button>
          </div>

          {/* ===== LISTA ===== */}
          {itens.length > 0 && (
            <>
              <h3>Itens adicionados</h3>

              {itens.map((item, index) => (
                <div className="card" key={index}>
                  <strong>{item.descricao}</strong>
                  <span>
                    {item.quantidade} x R$ {item.valor_unitario}
                  </span>
                  <span>Total: R$ {item.total.toFixed(2)}</span>

                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removerItem(index)}
                  >
                    <FiTrash /> Remover
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ===== TOTAL ===== */}
          <div className="card total-card">
            <strong>Valor Total:</strong>
            <span>R$ {valorTotal.toFixed(2)}</span>
          </div>

          <button type="submit" className="btn-submit">
            Enviar para Comitê
          </button>
        </form>
      </div>
    </>
  );
}
