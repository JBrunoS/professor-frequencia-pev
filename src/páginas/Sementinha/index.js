import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiLoader } from 'react-icons/fi'
import { useNavigate } from "react-router-dom";

import './style.css'
import Menu from "../Menu";
import api from "../../services/api";
import BackButton from "../../components/backButton";

export default function Sementinha() {

    const [participantes1, setParticipantes1] = useState([])
    const [participantes2, setParticipantes2] = useState([])
    const nome_turma = localStorage.getItem('nome_turma')
    const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')
    const navigate = useNavigate()
    const data = new Date()
    const year = data.getFullYear()
    const month = data.getMonth() + 1
    const day = data.getDate()
    const [state, setState] = useState(false)


    function handleBack() {
        navigate('/turma')
    }

    useEffect(() => {
        handleParticipantesManha()

    }, [state])

    async function handleParticipantesManha() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/turma/sementinha/${id_projeto}/${nome_turma}/${turno_turma}`)
                .then(response => {
                    
                    setParticipantes1(response.data[0])
                    setParticipantes2(response.data[1])
                })

        } catch (error) {
            console.log(error)
        }
    }

    async function handleNovaFrequencia(id) {
        setState(true)
        window.scrollTo(0, 0)


        const data = {
            objetivo: '',
            descricao: '',
            id_participante: id,
            day,
            month,
            year,
            nome_turma,
            turno_turma,
            id_professor,
            id_projeto
        }

        try {
            await api.post('/create/frequencia/sementinha', data)
                .then(response => {
                    alert(response.data)
                    setState(false)

                })
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <Menu />

            <div className="container-sementinha">
                <div className={state ? "modal-load" : "modal-loaded"}>
                    <FiLoader size={50} color='#f19864' />Aguarde...
                </div>
                <BackButton to="/" label="Voltar para Home" />
                <h2>Nova Frequência</h2>
                <span>{nome_turma} - {turno_turma}</span>

                <div className="legendas">
                    <div>
                        <div></div>
                        <p>0 Atend.</p>
                    </div>
                    <div>
                        <div></div>
                        <p>1 Atend.</p>
                    </div>
                    <div>
                        <div></div>
                        <p>2 Atend.</p>
                    </div>
                </div>

                <p>Já tem um atendimento esse mês</p>
                {
                    participantes1.map((incidents, index) => (
                        <div className="box-sementinha" key={index}>
                            <span>{incidents.nome}</span>
                            {/* <p>{handleCount(incidents.id_participante)}</p> */}
                            <button
                                type="button"
                                disabled={state}
                                onClick={
                                    () => handleNovaFrequencia(incidents.id_participante)
                                }
                                className={parseInt(incidents.count) >= 2 ? "button-selected" : "button-select-exist"}>{parseInt(incidents.count) >= 2 ? <FiCheck size={25} color='#FFFFFF' /> : (day + "/" + month + "/" + year)}</button>
                        </div>
                    ))
                }
                <p>Nenhum atendimento esse mês</p>
                {
                    participantes2.map((incidents, index) => (
                        <div className="box-sementinha" key={index}>
                            <span>{incidents.nome}</span>
                            {/* <p>{handleCount(incidents.id_participante)}</p> */}
                            <button
                                type="button"
                                disabled={state}
                                onClick={
                                    () => handleNovaFrequencia(incidents.id_participante)
                                }
                                className={parseInt(incidents.count) >= 2 ? "button-selected" : "button-select"}>{parseInt(incidents.count) >= 2 ? <FiCheck size={25} color='#FFFFFF' /> : (day + "/" + month + "/" + year)}</button>
                        </div>
                    ))
                }

            </div>
        </>
    )
}