import React, { useEffect, useState } from 'react'
import { FiArrowRightCircle, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import './style.css'

import Menu from '../Menu'
import api from '../../services/api'
import BackButton from '../../components/backButton'

export default function Turmas() {
    const [incidents, setIncidents] = useState([])
    const navigate = useNavigate()
    const id_projeto = localStorage.getItem('id_projeto')
    const id_professor = localStorage.getItem('id_professor')
    // const nome_professor = localStorage.getItem('nome_professor')

    useEffect(() => {
        handleIncidents()
    }, [id_projeto])

    async function handleIncidents() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/professor/turmas/${id_professor}/${id_projeto}`)
                .then(response => {
                    setIncidents(response.data)
                })
        } catch (error) {
            console.log(error)
        }
    }

    function handleSementinha(nome_turma) {
        navigate('/turnos')
        localStorage.setItem('nome_turma', nome_turma)

    }
    return (
        <>
            <Menu />
            <div className='container-turmas'>
                <BackButton to="/" label="Voltar para Home" />

                <span>Turmas</span>

                {incidents.map((incidents, index) => (
                    <div onClick={() => handleSementinha(incidents[0].nome)} className='box-turma' key={index}>
                        <div className='descricao-turma'>
                            <div>
                                <h2>{incidents[0].nome}</h2>
                            </div>
                            <div>
                                <p>{incidents[1].count} alunos</p>
                            </div>
                        </div>
                        <div className='icon-turma'>
                            <FiArrowRightCircle size={25} color='#f18140' />
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}