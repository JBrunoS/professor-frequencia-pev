import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi'

import Menu from '../Menu'

import './style.css'
import api from '../../services/api'

export default function HistoricoFrequenciaDetalhes() {
    const [incidentsPresentes, setIncidentsPresentes] = useState([])
    const [objetivo, setObjetivo] = useState('')
    const [descricao, setDescricao] = useState('')

    const nome_turma = localStorage.getItem('nome_turma')
    const dia_turma = localStorage.getItem('dia_turma')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')
    const mes_turma = localStorage.getItem('mes_turma')
    const ano_turma = localStorage.getItem('ano_turma')

    const navigate = useNavigate()

    useEffect(() => {
        handleIncidents()
    }, [id_projeto])

    async function handleIncidents() {

        if (!id_projeto) {
            return
        }
        
        try {
            await api.get(`/get/frequencia/${id_projeto}/${nome_turma}/${turno_turma}/${mes_turma}/${ano_turma}/${dia_turma}`)
                .then(response => {
                    setIncidentsPresentes(response.data)
                    setObjetivo(response.data[0].objetivo)
                    setDescricao(response.data[0].descricao)
                })
        } catch (error) {
            console.log(error)
        }
    }


    function handleBack() {
        navigate('/historico')
    }
    return (
        <>
            <Menu />
            <div className='container-historico-frequencia'>
                <FiArrowLeft onClick={() => handleBack()} size={30} color='#000000' />
                <span>{nome_turma} - {turno_turma}</span>
                <span>{dia_turma}/{mes_turma}/{ano_turma}</span>

                <div className='objetivo-frequencia'>
                    <label>Objetivo</label>
                    <input type='text' disabled value={objetivo} />
                </div>
                <div className='objetivo-frequencia'>
                    <label>Descrição</label>
                    <textarea disabled value={descricao}></textarea>
                </div>
                
                {incidentsPresentes.map((incidents => (
                    <div key={incidents.id}>
                        <span>{incidents.br}-{incidents.nome}</span>

                        {incidents.status ? <FiCheck size={20} color='green' /> : <FiX size={20} color='red' />}
                        
                    </div>
                )))}

                <button onClick={() => handleBack()}>Voltar</button>
            </div>
        </>
    )
}