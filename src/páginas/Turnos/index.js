import React, { useEffect, useState } from "react";
import { FiArrowRightCircle, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";

import './style.css'

import Menu from '../Menu'
import api from "../../services/api";

export default function Turnos() {
    const navigate = useNavigate()
    const nome_turma = localStorage.getItem('nome_turma')
    // const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const [manha, setManha] = useState([])
    const [tarde, setTarde] = useState([])

    function handleTurno(turno) {
        localStorage.setItem('turno_turma', turno)
        navigate('/turma')
    }
    function handleBack() {
        navigate('/turmas')
    }

    useEffect(() => {
        loadCount();
    }, [nome_turma])

    async function loadCount() {

        if (!id_projeto) {
            return
        }

        await api.get(`/tarde/${nome_turma}/${id_projeto}`)
            .then(response => {
                setTarde(response.data)
            })

        await api.get(`/manha/${nome_turma}/${id_projeto}`)
            .then(response => {
                setManha(response.data)
            })
    }
    return (
        <>
            <Menu />
            <div className="container-turnos">
                <div className='back' onClick={() => handleBack()}>
                    <FiArrowLeft size={30} color='#000' />
                    <span>Voltar</span>
                </div>

                <span>{nome_turma}</span>

                <div onClick={() => handleTurno('manha')} className='box-turnos'>
                    <div className='descricao-turnos'>
                        <div>
                            <h2>Manhã</h2>
                        </div>
                        <div>
                            <p>{manha.count} {manha.count > 1 ? "Alunos" : "Aluno"}</p>
                        </div>
                    </div>
                    <div className='icon-turnos'>
                        <FiArrowRightCircle size={30} color='#f18140' />
                    </div>
                </div>
                <div onClick={() => handleTurno('tarde')} className='box-turnos'>
                    <div className='descricao-turnos'>
                        <div>
                            <h2>Tarde</h2>
                        </div>
                        <div>
                            <p>{tarde.count} {tarde.count > 1 ? "Alunos" : "Aluno"}</p>
                        </div>
                    </div>
                    <div className='icon-turnos'>
                        <FiArrowRightCircle size={30} color='#f18140' />
                    </div>
                </div>
            </div>
        </>
    )
}