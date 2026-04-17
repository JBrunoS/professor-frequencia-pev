import * as React from "react"
import { useState, useMemo } from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import { FiXCircle, FiCheckCircle } from "react-icons/fi"

import Menu from "../Menu"
import useParticipantes from "../../hooks/useParticipantes"
import BackButton from "../../components/backButton"

import "./style.css"

export default function Participantes() {
  const { options, frequencia, dias, percentuais, loading, fetchFrequencia } =
    useParticipantes()

  const [nome, setNome] = useState("")
  const [br, setBr] = useState("")

  const temFrequencia = useMemo(() => frequencia.length > 0, [frequencia])

  function handleChange(_, value) {
    if (!value) {
      setNome("")
      setBr("")
      return
    }

    setNome(value.nome)
    setBr(value.br)
    fetchFrequencia(value.id)
  }

  return (
    <>
      <Menu />

      <div className="container-participantes">
        <BackButton to="/" label="Voltar para Home" />

        <div className="participantes-header">
          <h2>Participantes</h2>
          <p>Selecione um participante para visualizar a frequência e o saldo.</p>
        </div>

        <div className="participantes-search">
          <Autocomplete
            options={options}
            groupBy={option => option.faixa}
            getOptionLabel={option => `${option.br} - ${option.nome}`}
            onChange={handleChange}
            renderInput={params => (
              <TextField {...params} label="Digite um nome" />
            )}
            sx={{ width: "100%", maxWidth: 420 }}
          />
        </div>

        {loading && <p className="participantes-loading">Carregando frequência...</p>}

        <div className="content-participantes-turmas">
          {(br || nome) && (
            <div className="participantes-selected">
              <h3>
                {br} {nome ? `- ${nome}` : ""}
              </h3>

              {temFrequencia && (
                <span>Saldo Papagaios: {frequencia[0].saldo}</span>
              )}
            </div>
          )}

          {frequencia.map((item, index) => {
            const diasDaTurma = dias[index] || []

            return (
              <section className="participantes-card" key={`${item.nome}-${index}`}>
                <div className="participantes-card__header">
                  <h4>{item.nome}</h4>
                  {percentuais[index] !== undefined && (
                    <span className="participantes-percentual">
                      Frequência: {percentuais[index]}%
                    </span>
                  )}
                </div>

                <div className="participantes-table-wrapper">
                  <table className="participantes-table">
                    <thead>
                      <tr>
                        {diasDaTurma.length > 0 ? (
                          diasDaTurma.map((d, i) => (
                            <th key={i}>
                              {d.dia}/{d.mes}
                            </th>
                          ))
                        ) : (
                          <th>Nenhum dia encontrado</th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        {diasDaTurma.length > 0 ? (
                          diasDaTurma.map((d, i) => (
                            <td key={i}>
                              {d.status ? (
                                <FiCheckCircle className="status-icon status-icon--ok" />
                              ) : (
                                <FiXCircle className="status-icon status-icon--nok" />
                              )}
                            </td>
                          ))
                        ) : (
                          <td>Nenhum dado disponível</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}