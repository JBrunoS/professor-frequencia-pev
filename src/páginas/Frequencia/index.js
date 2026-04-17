import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiLoader } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import Menu from '../Menu'
import api from '../../services/api'

import './style.css'
import BackButton from '../../components/backButton'

var frequencia = []
var participantes = []

export default function Frequencia() {
    const nome_turma = localStorage.getItem('nome_turma')
    const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')

    const [participantesManha, setParticipantesManha] = useState([])
    const [estado, setEstado] = useState(false)



    const [objetivo, setObjetivo] = useState('')
    const [descricao, setDescricao] = useState('')

    const navigate = useNavigate()
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()


    useEffect(() => {
        handleParticipantesManha()
    }, [id_projeto])

    useEffect(() =>{
        resetFrequencia()
    }, [])

    async function handleParticipantesManha() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/turma/${id_projeto}/${nome_turma}/${turno_turma}`)
                .then(response => {

                    setParticipantesManha(response.data)

                    for (let i = 0; i < response.data.length; i++) {

                        const found = participantes.find(element => element === response.data[i].id_participante)

                        if (found) {

                            // participantes = participantes.filter(element => element !== response.data[i].id_participante)
                            return

                        } else {
                            participantes.push(response.data[i].id_participante)
                        }
                    }
                })


        } catch (error) {
            console.log(error)
        }

    }

    function addFrequencia(id) {
        const found = frequencia.find(element => element === id)

        if (found) {
            frequencia = frequencia.filter(element => element !== id)

        } else {
            frequencia.push(id)
        }
    }

    function resetFrequencia(){
        setObjetivo('')
        setDescricao('')
        frequencia.length = 0
        participantes.length = 0
    }

    function handleBack() {
        setObjetivo('')
        setDescricao('')
        frequencia.length = 0
        participantes.length = 0

        navigate('/turma')
    }

    async function handleSalvar() {

        setEstado(true)
        window.scrollTo(0, 5)

        const data = {
            objetivo,
            descricao,
            frequencia,
            participantes,
            day,
            month,
            year,
            nome_turma,
            turno_turma,
            id_professor,
            id_projeto
        }
        try {

            await api.post('/create/frequencia', data)
                .then(response => {
                    if (response.status === 204) {
                        alert('Já existe uma frequência para esse dia. Esperar uma nova data.')
                    } else {
                        alert(response.data)

                    }

                    setEstado(false)



                    setObjetivo('')
                    setDescricao('')
                    frequencia.length = 0
                    participantes.length = 0
                    navigate('/turma')

                })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Menu />
            <div className='container-frequencia'>
                <div className={estado ? "frequencia-modal-load" : "frequencia-modal-loaded"}>
                    <FiLoader size={50} color='#f19864' />Aguarde...
                </div>
                <BackButton to="/turma" label="Voltar para Turma" />
                {/* <h2>Nova Frequência</h2> */}
                <span>{nome_turma + ' - ' + turno_turma} <br /> Data: {day + '/' + month + '/' + year}</span>


                <div className='objetivo-frequencia'>
                    <label>Objetivo</label>
                    <input
                        type='text'
                        required
                        value={objetivo}
                        onChange={e => setObjetivo(e.target.value)}
                    />
                </div>
                <div className='objetivo-frequencia'>
                    <label>Descrição</label>
                    <textarea
                        required
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                    >
                    </textarea>
                </div>

                {participantesManha.map((incidents, index) => (
                    <div key={index}>
                        <span>{incidents.nome}</span>
                        <input
                            type='checkbox'
                            disabled={objetivo === '' || descricao === '' ? true : false}
                            onChange={e => addFrequencia(incidents.id_participante)}
                        />
                    </div>
                ))}



                <button className='button' type='button' onClick={() => handleSalvar()}>Salvar Frequência</button>
            </div>
        </>
    )
}