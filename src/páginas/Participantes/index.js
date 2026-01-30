import * as React from "react"
import { useState } from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import { FiXCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

import Menu from "../Menu"
import useParticipantes from "../../hooks/useParticipantes"

import "./style.css"

export default function Participantes() {
  const navigate = useNavigate()

  const {
    options,
    frequencia,
    dias,
    percentuais,
    loading,
    fetchFrequencia
  } = useParticipantes()

  const [nome, setNome] = useState("")
  const [br, setBr] = useState("")

  function handleBack() {
    navigate("/")
  }

  return (
    <>
      <Menu />

      <div className="container-participantes">
        <div className="back" onClick={handleBack}>
          <FiArrowLeft size={30} />
          <span>Voltar</span>
        </div>

        <h2>Participantes</h2>

        <Autocomplete
          options={options}
          groupBy={option => option.faixa}
          getOptionLabel={option => `${option.br} - ${option.nome}`}
          sx={{ width: 300 }}
          onChange={(event, value) => {
            if (!value) return
            setNome(value.nome)
            setBr(value.br)
            fetchFrequencia(value.id)
          }}
          renderInput={params => (
            <TextField {...params} label="Digite um nome" />
          )}
        />

        {loading && <p>Carregando frequência...</p>}

        <div className="content-participantes-turmas">
          <h3>{br} - {nome}</h3>

          {frequencia.length > 0 && (
            <span>Saldo Papagaios: {frequencia[0].saldo}</span>
          )}

          {frequencia.map((item, index) => (
            <table key={index}>
              <thead>
                <tr>
                  <th colSpan={20}>{item.nome}</th>
                </tr>
                
              </thead>

              <tbody>
                <tr>
                  {dias[index]?.length ? (
                    dias[index].map((d, i) => (
                      <th key={i}>{d.dia}/{d.mes}</th>
                    ))
                  ) : (
                    <td>-</td>
                  )}
                </tr>
                <tr>
                  {dias[index]?.length ? (
                    dias[index].map((d, i) => (
                      <td key={i}>
                        {d.status
                          ? <FiCheckCircle color="green" />
                          : <FiXCircle color="red" />}
                      </td>
                    ))
                  ) : (
                    <td>Nenhum dado</td>
                  )}
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={20}>
                    Percentual de frequência: {percentuais[index]}%
                  </td>
                </tr>
              </tfoot>
            </table>
          ))}
        </div>
      </div>
    </>
  )
}
