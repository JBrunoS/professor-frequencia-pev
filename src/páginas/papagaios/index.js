import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiLoader, FiDollarSign } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import Menu from '../Menu'
import api from '../../services/api'

import './style.css'
import BackButton from '../../components/backButton'
import { toast } from 'react-toastify'

var frequencia = []
var participantes = []

export default function Papagaios() {
    const nome_turma = localStorage.getItem('nome_turma')
    const id_professor = localStorage.getItem('id_professor')
    const id_projeto = localStorage.getItem('id_projeto')
    const turno_turma = localStorage.getItem('turno_turma')

    const [participantesManha, setParticipantesManha] = useState([])
    const [estado, setEstado] = useState(false)

    const [valor, setValor] = useState('')

    const navigate = useNavigate()
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()


    useEffect(() => {
        handleParticipantesManha()
    }, [id_projeto])

    useEffect(() => {
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

    function resetFrequencia() {

        frequencia.length = 0
        participantes.length = 0
    }

    function handleBack() {


        frequencia.length = 0
        participantes.length = 0

        navigate('/turma')
    }

    async function handleSalvar() {

        setEstado(true)
        window.scrollTo(0, 5)

        const data = {
            valor,
            frequencia,
            participantes
        }

        try {

            await api.put('/saldo/participantes', data)
                .then(response => {
                    toast.success("Papagaio cadastrado com sucesso!")
                    setEstado(false)
                    frequencia.length = 0
                    participantes.length = 0
                    navigate('/turma')
                })
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
            <Menu />
            <div className='container-papagaios'>
                <div className={estado ? "papagaios-modal-load" : "papagaios-modal-loaded"}>
                    <FiLoader size={50} color='#f19864' />Aguarde...
                </div>
                <BackButton to="/turma" label="Voltar para Turma" />
                <span>{nome_turma + ' - ' + turno_turma} - <br /> Data: {day + '/' + month + '/' + year}</span>

                <h2>Depositar papagaios</h2>
            

                <select
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                >
                    <option></option>
                    <option value={1}>$1 papagaio</option>
                    <option value={2}>$2 papagaios</option>
                    <option value={5}>$5 papagaios</option>
                    <option value={10}>$10 papagaios</option>
                    <option value={20}>$20 papagaios</option>
                </select>

                {participantesManha.map((incidents, index) => (
                    <div key={index}>
                        <span>{incidents.nome}</span>
                        <input
                            type='checkbox'
                            disabled={valor === '' ? true : false}
                            onChange={e => addFrequencia(incidents.id_participante)}
                        />
                    </div>
                ))}



                <button className='button' type='button' onClick={() => handleSalvar()}>Depositar <FiDollarSign size={20} color='#FFF' /></button>
            </div>
        </>
    )
}