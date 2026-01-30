import { useState, useEffect, useMemo } from "react"
import api from "../services/api"

export default function useParticipantes() {
  const [participantes, setParticipantes] = useState([])
  const [frequencia, setFrequencia] = useState([])
  const [dias, setDias] = useState([])
  const [percentuais, setPercentuais] = useState([])
  const [loading, setLoading] = useState(false)

  const id_projeto = localStorage.getItem("id_projeto")

  const data = new Date()
  const mes = data.getMonth() + 1
  const ano = data.getFullYear()

  // 🔹 Buscar participantes
  useEffect(() => {
    if (!id_projeto) return

    async function fetchParticipantes() {
      try {
        const response = await api.get(`/participantes/${id_projeto}`)
        setParticipantes(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchParticipantes()
  }, [id_projeto])

  // 🔹 Buscar frequência por participante
  async function fetchFrequencia(id_participante) {
    if (!id_participante) return

    setLoading(true)

    try {
      const response = await api.get(
        `/get/frequencia-aluno/${id_participante}/${mes}/${ano}`
      )

      setFrequencia(response.data)

      const diasCalculados = response.data.map(item => item[0] || [])

      const percentuaisCalculados = diasCalculados.map(dias => {
        if (!dias.length) return 0
        const presentes = dias.filter(d => d.status === 1).length
        return ((presentes / dias.length) * 100).toFixed(1)
      })

      setDias(diasCalculados)
      setPercentuais(percentuaisCalculados)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Options do Autocomplete (otimizado)
  const options = useMemo(() => {
    return participantes
      .map(p => ({ ...p, faixa: p.faixa }))
      .sort((a, b) => -b.faixa.localeCompare(a.faixa))
  }, [participantes])

  return {
    options,
    frequencia,
    dias,
    percentuais,
    loading,
    fetchFrequencia
  }
}
