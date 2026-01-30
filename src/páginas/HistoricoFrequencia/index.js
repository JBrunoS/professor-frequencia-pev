import React, { useEffect, useState } from 'react'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import './style.css'
import Menu from '../Menu'
import api from '../../services/api'


export default function HistoricoFrequencia() {
    const nome_turma = localStorage.getItem('nome_turma')
    // const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')
    const mes_turma = localStorage.getItem('mes_turma')
    const ano_turma = localStorage.getItem('ano_turma')

    const [incidents, setIncidents] = useState([])
    const navigate = useNavigate()



    useEffect(() => {
        handleIncidents()
    }, [id_projeto])

    const meses = [
        {},
        {mes: 'Janeiro'},
        {mes: 'Fevereiro'},
        {mes: 'Março'},
        {mes: 'Abril'},
        {mes: 'Maio'},
        {mes: 'Junho'},
        {mes: 'Julho'},
        {mes: 'Agosto'},
        {mes: 'Setembro'},
        {mes: 'Outubro'},
        {mes: 'Novemro'},
        {mes: 'Dezembro'},
]


    async function handleIncidents() {

        if (!id_projeto) {
            return
        }
        
        try {
            await api.get(`/get/frequencia/${id_projeto}/${nome_turma}/${turno_turma}/${mes_turma}/${ano_turma}`)
                .then(response => {
                    setIncidents(response.data)
                    
                })
        } catch (error) {
            console.log(error)
        }
    }

    function handleHistorico(dia) {
        localStorage.setItem('dia_turma', dia)

        navigate('/listaPresenca')
    }

    function handleBack() {
        navigate('/turma')
    }
    
    return (
        <>
            <Menu />
            <div className='container-historico'>
                <FiArrowLeft onClick={() => handleBack()} size={30} color='#000000' />
                <span>{nome_turma} - {turno_turma}</span>
                <h3>{meses[mes_turma].mes}</h3>

                {incidents.map((incidents, index) => (
                    <div key={index} onClick={() => handleHistorico(incidents.dia)} className='box-historico'>
                        <span>{incidents.dia}/{incidents.mes}/{incidents.ano}</span>
                        <FiArrowRight size={30} color='#FFFFFF' />
                    </div>
                ))}
            </div>
        </>
    )
}