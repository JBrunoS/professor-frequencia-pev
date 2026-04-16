import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBook, FiDatabase, FiDollarSign, FiSearch } from 'react-icons/fi'

import './style.css'
import Menu from '../Menu'
import api from '../../services/api'

export default function Turma() {
    const nome_turma = localStorage.getItem('nome_turma')
    // const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')

    const [registro, setRegisto] = useState('')
    const [incidentsFrequencia, setIncidentsFrequencia] = useState([])
    const [participantesManha, setParticipantesManha] = useState([])
    const [tipo_programa, setTipoPrograma] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        handleParticipantesManha()
        handleIncidentsFrequencia()
    }, [id_projeto])



    async function handleParticipantesManha() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/turma/${id_projeto}/${nome_turma}/${turno_turma}`)
                .then(response => {

                    setParticipantesManha(response.data)
                    setTipoPrograma(response.data[0].tipo_programa)
                })


        } catch (error) {
            console.log(error)
        }
    }


    async function handleIncidentsFrequencia() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/get/frequencia/${id_projeto}/${nome_turma}/${turno_turma}`)
                .then(response => {
                    setIncidentsFrequencia(response.data)
                })
        } catch (error) {
            console.log(error)
        }
    }


    function handleBack() {
        navigate('/turnos')
    }

    function handleNovaFrequencia() {

        if (tipo_programa === 'Atendimento no Lar') {
            navigate('/sementinha')
        } else {
            navigate('/frequencia')
        }

    }

    function handlePapagaios() {
        navigate('/papagaios')
    }

    function handleHistoricoFrequencia() {

        if (registro === '') {
            alert('Favor, selecionar um mês')
            return
        } else {

            if (registro.length > 6) {
                localStorage.setItem('mes_turma', registro.slice(0, 2))
                localStorage.setItem('ano_turma', registro.slice(3, 7))
            } else {
                localStorage.setItem('mes_turma', registro.slice(0, 1))
                localStorage.setItem('ano_turma', registro.slice(2, 6))
            }
        }

        navigate('/historico')
    }
    return (
        <>
            <Menu />
            <div className="container-turmas">
                <div className='back' onClick={() => handleBack()}>
                    <FiArrowLeft size={30} color='#000' />
                    <span>Voltar</span>
                </div>
                <span>{nome_turma + ' - ' + turno_turma}</span>

                <div className="buttons-turmas">
                    <div>
                        <select
                            value={registro}
                            onChange={e => setRegisto(e.target.value)}
                        >
                            <option value=''>Ver aulas dadas</option>
                            {incidentsFrequencia.map((incidents, index) => (
                                <option key={index}>{incidents.mes}/{incidents.ano}</option>
                            ))}
                        </select>
                        <button onClick={() => handleHistoricoFrequencia()}><FiSearch size={20} color="#FFF" /></button>
                    </div>
                    <button disabled={!tipo_programa ? true : false} onClick={() => handlePapagaios()} > <FiDollarSign size={20} color="#FFF" /> </button>
                    <button disabled={!tipo_programa ? true : false} onClick={() => handleNovaFrequencia()} ><FiDatabase size={20} color="#FFF" /> </button>

                </div>

                <div className="participantes-turmas">
                    {participantesManha.map((incidents, index) => (
                        <span key={incidents.id_participante}>{incidents.br + ' - ' + incidents.nome}</span>
                    ))}
                </div>
            </div>
        </>
    )
}