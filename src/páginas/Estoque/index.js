import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'


import './style.css'

import Menu from '../Menu'
import api from '../../services/api'

export default function Estoque() {
    // const [incidents, setIncidents] = useState([])
    const navigate = useNavigate()
    const id_projeto = localStorage.getItem('id_projeto')
    const id_professor = localStorage.getItem('id_professor')
    const nome_professor = localStorage.getItem('nome_professor')
    const [area, setArea] = useState('')
    const [incidentArea, setIncidentArea] = useState([])
    const [incidentEstoque, setIncidentEstoque] = useState([])
    const [justificativa, setJustificativa] = useState('')
    const [date, setDate] = useState('')
    const [trabalho, setTrabalho] = useState('')

    const data = new Date()
    const mes = data.getMonth() + 1
    const ano = data.getFullYear()

    useEffect(() => {
        handleAreas()
    }, [])

    useEffect(() => {
        handleEstoque()
    }, [area])

    useEffect(() => {
        setArea('')
    }, [trabalho])

    async function handleAreas() {
        try {
            await api.get(`areas/${id_projeto}`)
                .then(res => {
                    setIncidentArea(res.data)
                })
        } catch (error) {
            alert(error)
        }
    }

    async function handleEstoque() {
        if (area === '') {
            setIncidentEstoque([])
            return
        }

        if (trabalho === 'Penedo') {

            try {
                await api.get(`estoque/${3}/${area}`)
                    .then(res => {
                        setIncidentEstoque(res.data)
                    })
            } catch (error) {
                alert(error)
            }

            return
        }

        if (trabalho === 'Amanari') {
            try {
                await api.get(`estoque/${id_projeto}/${area}`)
                    .then(res => {
                        setIncidentEstoque(res.data)
                    })
            } catch (error) {
                alert(error)
            }

            return
        }

        if (id_projeto === '2') {
            try {
                await api.get(`estoque/${id_projeto}/${area}`)
                    .then(res => {
                        setIncidentEstoque(res.data)
                    })
            } catch (error) {
                alert(error)
            }

            return
        }


    }

    function increment(id, qtd) {

        let data = parseInt(document.getElementById(id).innerText)

        if (data > 0 && data === qtd) {
            alert('Quantidade máxima atingida.')
            return
        }

        if (qtd > 0) {
            data = data + 1
            document.getElementById(id).innerText = data
        } else {
            alert('Estoque zerado, não é possível dar baixa')
            return
        }
    }

    function decrement(id) {
        let data = parseInt(document.getElementById(id).innerText)

        if (data > 0) {
            data = data - 1
        }
        document.getElementById(id).innerText = data
    }

    async function handleBaixa(id, qtd, descricao) {

        if (qtd.innerText === '0') {
            return
        }
        const quantidade = parseInt(qtd.innerText)

        if (date.slice(0, 4) > ano || date.slice(5, 7) > mes) {
            alert('Data não pode ser maior que a atual')
            return
        }

        const body = { id, quantidade }
        const body1 = { quantidade, descricao, area, date, nome_professor, justificativa }

        // console.log(body1)

        if (trabalho === 'Penedo') {
            try {
                await api.post(`baixa-estoque/${3}`, body)
                    .then(res => {
                        alert(res.data)
                        handleEstoque()
                        document.getElementById(id).innerText = '0'
                    })
                await api.post(`create-report/${3}`, body1)
                    .then(res => {
                        alert(res.data)
                    })
            } catch (error) {
                console.log(error)
            }

            return
        }

        try {
            await api.post(`baixa-estoque/${id_projeto}`, body)
                .then(res => {
                    alert(res.data)
                    handleEstoque()
                    document.getElementById(id).innerText = '0'
                })
            await api.post(`create-report/${id_projeto}`, body1)
                .then(res => {
                    alert(res.data)
                })
        } catch (error) {
            console.log(error)
        }

    }
    function handleBack() {
        navigate('/')
    }


    return (
        <>
            <Menu />
            <div className='container-estoque'>
                <div className='back' onClick={() => handleBack()}>
                    <FiArrowLeft size={30} color='#000' />
                    <spna>Voltar</spna>
                </div>
                <span>Saída de Estoque</span>
                <input type='date' value={date} onChange={e => setDate(e.target.value)} />
                <select
                    value={justificativa}
                    onChange={e => setJustificativa(e.target.value)}
                >
                    <option value=''>Selecione uma justificativa</option>
                    <option value='Atendimento de participantes'>Atendimento de participantes</option>
                    <option value='Planejamento'>Planejamento</option>
                    <option value='Reunião com os pais'>Reunião com os pais</option>
                    <option value='Atividades Extras'>Atividades Extras</option>
                    <option value='Evento do projeto'>Evento do projeto</option>
                    <option value='Evento da Igreja'>Evento da Igreja</option>
                    <option value='Para família'>Para família</option>
                    <option value='Outros'>Outros</option>
                </select>
                {id_projeto == 1 ?
                    <select
                        value={trabalho}
                        onChange={e => setTrabalho(e.target.value)}
                    >
                        <option>Selecione um local de trabalho</option>
                        <option value='Amanari'>Amanari</option>
                        <option value='Penedo'>Penedo</option>
                    </select>
                    :
                    ''
                }

                {id_projeto == 1 && trabalho === 'Penedo' ?
                    <select
                        value={area}
                        onChange={e => setArea(e.target.value)}
                    >
                        <option value=''>Selecione uma área</option>
                        <option value='Limpeza'>Limpeza</option>
                        <option value='Cozinha'>Cozinha</option>
                    </select>
                    :

                    trabalho === '' ? '' :
                        <select
                            value={area}
                            onChange={e => setArea(e.target.value)}
                        >
                            <option value=''>Selecione uma área</option>
                            {incidentArea.map((incidents, index) => (
                                <option key={index} value={incidents.area}>{incidents.area}</option>
                            ))}
                        </select>


                }

                {id_projeto === '2' ? <select
                    value={area}
                    onChange={e => setArea(e.target.value)}
                >
                    <option value=''>Selecione uma área</option>
                    {incidentArea.map((incidents, index) => (
                        <option key={index} value={incidents.area}>{incidents.area}</option>
                    ))}
                </select>
                    : ''
                }




                {incidentEstoque.map((incidents => (
                    <div key={incidents.id} className='content-estoque'>

                        <div>
                            <span>{incidents.descricao}</span>
                            <span>{incidents.qtd}</span>
                        </div>
                        <div>
                            <button onClick={() => decrement(incidents.id)}>-</button>
                            <span id={incidents.id}>0</span>
                            <button onClick={() => increment(incidents.id, incidents.qtd)} >+</button>
                        </div>
                        <button className='button' onClick={() => handleBaixa(incidents.id, document.getElementById(incidents.id), incidents.descricao)} >baixa</button>
                    </div>
                )))}

            </div>
        </>
    )
}