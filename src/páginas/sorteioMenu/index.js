import React, { useEffect, useState } from 'react'
import { FiTrash2, FiEdit, FiShare2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { RWebShare } from "react-web-share";

import './style.css'

import Menu from '../Menu'
import api from '../../services/api'
import BackButton from '../../components/backButton';

export default function SorteioMenu() {
    const id_projeto = localStorage.getItem('id_projeto')
    const id_professor = localStorage.getItem('id_professor')
    const nome_professor = localStorage.getItem('nome_professor')
    const funcao_professor = localStorage.getItem('funcao_professor')
    const [sorteio, setSorteio] = useState('2 bicicletas e 1 iPhone 8 sem carregador')
    const [vendidosColaborador, setVendidosColaborador] = useState(0)
    const [incidents, setIncidents] = useState([])
    const [vendedores, setVendedores] = useState([])
    const [pontos, setPontos] = useState([])
    const [pontosVendedores, setPontosVendedores] = useState([])
    const [pontosIndividuais, setPontosIndividuais] = useState([])
    const [edit, setEdit] = useState(false)
    const [excluir, setExcluir] = useState(false)
    const [share, setShare] = useState(false)
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [novoNome, setNovonome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [telefone, setTelefone] = useState('')
    const [status, setStatus] = useState('')
    const [id, setId] = useState('')

    const array = []
    const array1 = []
    const array2 = []

    const navigate = useNavigate()

    useEffect(() => {
        handleTotalPontosVendedor()
    }, [])

    useEffect(() => {
        handleVendas()
    }, [open])

    useEffect(() => {
        handlePontos()
    }, [incidents])

    async function handleTotalPontosVendedor() {
        try {
            await api.get(`/vendedor/sorteio/${id_professor}`)
                .then(res => {
                    setVendidosColaborador(res.data.count)
                })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleVendas() {

        try {
            await api.get(`/vendedor/nomes/${id_professor}`)
                .then(res => {
                    setIncidents(res.data)
                })
        } catch (error) {
            console.log(error)
        }
    }

    async function handlePontos() {

        if (incidents.length > 0) {
            for (let i = 0; i < incidents.length; i++) {
                try {
                    await api.get(`/compras/${id_professor}/${incidents[i].nome}`)
                        .then(res => {
                            // console.log(res.data[0].count)
                            array.push(res.data[0].count)
                        })
                } catch (error) {
                    console.log(error)
                }

            }
            setPontos(array)
        }

    }

    function handleModalEdit(id) {
        setOpen(true)
        setEdit(true)

        setNome(incidents[id].nome)
        setNovonome(incidents[id].nome)
        setEndereco(incidents[id].endereco)
        setTelefone(incidents[id].telefone)
        setStatus(incidents[id].status)
        setId(incidents[id])
    }

    async function handleModalExcluir(id, nome) {
        setOpen(true)
        setExcluir(true)

        setNome(incidents[id].nome)
        setEndereco(incidents[id].endereco)
        setTelefone(incidents[id].telefone)
        setStatus(incidents[id].status)

        try {
            await api.get(`/pessoa/${id_professor}/${nome}`)
                .then(res => {
                    setPontosIndividuais(res.data)
                })
        } catch (error) {
            console.log(error)
        }

    }

    async function handleShare(id, nome) {
        setNome(nome)
        setId(id)
        setShare(true)
        setOpen(true)

        try {
            await api.get(`/pessoa/${id_professor}/${nome}`)
                .then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        array1.push(res.data[i].id)
                    }
                    setPontosIndividuais(array1)
                })
        } catch (error) {
            console.log(error)
        }
    }

    async function EditPessoa(id) {
        const data = { novoNome, endereco, telefone, status }

        try {
            await api.put(`/pessoa/edit/${id_professor}/${nome}`, data)
                .then(res => {
                    alert(res.data)
                })
        } catch (error) {
            console.log(error)
        }

        closeModal()
    }

    async function showPontos() {
        try {
            await api.get(`professores/${id_projeto}/${1}`)
                .then(res => {
                    setVendedores(res.data)

                    for (let i = 0; i < res.data.length; i++) {
                        api.get(`vendedor/sorteio/${res.data[i].id}`)
                        .then(response =>{
                            
                            array2.push(response.data.count)
                        })
                    }
                    setPontosVendedores(array2)
                })
        } catch (error) {
            console.log(error)
        }

        setOpen(true)
        setShow(true)
    }

    function closeModal() {
        setOpen(false)
        setEdit(false)
        setExcluir(false)
        setShare(false)
    }

    return (
        <>
            <Menu />
            <div className='container-menu-sorteio'>
                <BackButton to="/" label="Voltar para Home" />
                <button className='button' onClick={() => navigate('/sorteio')}>Vender</button>
                {funcao_professor === 'Diretor(a)' && <button onClick={() => showPontos()} style={{ backgroundColor: '#c2c2c2', color: '#000000', margin: '5px auto 0px' }} >Ver Vendas Equipe</button>}
                {funcao_professor === 'Coordenador(a)' && <button onClick={() => showPontos()} style={{ backgroundColor: '#c2c2c2', color: '#000000', margin: '5px auto 0px' }} >Ver Vendas Equipe</button>}

                <div className='content-sorteio-vendidos' style={{ marginBottom: '40px' }} >
                    <h2>Pontos vendidos: {vendidosColaborador}</h2>

                    {incidents.map((incident, index) => (
                        <div key={incident.id} className={incident.status ? 'body-card-pago' : 'body-card'}>
                            <div>
                                <span>{incident.nome}</span>
                                <span> {pontos[index]} Pontos</span>
                            </div>

                            <div>
                                <FiEdit onClick={() => handleModalEdit(index)} size={20} color={incident.status ? '#FFFFFF' : '#f8751d'} />
                                <FiTrash2 onClick={() => handleModalExcluir(index, incident.nome)} size={20} color={incident.status ? '#FFFFFF' : '#eb2e2e'} />
                                <FiShare2 size={20} color={incident.status ? '#FFFFFF' : '#258d21'} onClick={() => handleShare(index, incident.nome)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={open ? 'modal' : 'modal-hidden'}>
                    {edit &&
                        <div>
                            <h2>Editar</h2>
                            <span>Nome</span>
                            <input value={novoNome} onChange={e => setNovonome(e.target.value)} />
                            <span>Endereço</span>
                            <input value={endereco} onChange={e => setEndereco(e.target.value)} />
                            <span>Telefone</span>
                            <input value={telefone} onChange={e => e.target.value} />
                            <span>Status</span>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value={0}>Não pago</option>
                                <option value={1}>Pago</option>
                            </select>

                            <div>
                                <button onClick={() => closeModal()}>Cancelar</button>
                                <button type='button' onClick={() => EditPessoa(id)}>Salvar</button>
                            </div>

                        </div>}

                    {excluir &&
                        <div>
                            <h2>Excluir</h2>
                            <span>{nome}</span>
                            <span>{endereco}</span>
                            <span>{telefone}</span>

                            <span>{status ? 'Pago' : 'Não pago ainda'}</span>

                            {pontosIndividuais.map((incident, index) => (
                                <div className='excluir'>
                                    <h3>{incident.id}</h3>
                                    <FiTrash2 size={20} color='#eb2e2e' />
                                </div>
                            ))}
                            <button onClick={() => closeModal()}>Voltar</button>
                        </div>
                    }
                    {share &&
                        <div>
                            <span style={{ fontWeight: 'lighter', fontSize: '20px' }}><b>Sorteio: </b> {sorteio}</span>
                            <span style={{ fontWeight: 'lighter', fontSize: '20px' }}><b>Nome: </b>{nome}</span>
                            <span style={{ fontWeight: 'lighter', fontSize: '20px' }}><b>Pontos: </b>{pontosIndividuais.map(index => <span key={index}>{index + ' '}</span>)}</span>
                            <RWebShare
                                data={{
                                    text: `Olá, *${nome}*. \n\n Você está participando do sorteio de *${sorteio}* do *Projeto Ensinando a Viver*. \n\nEstes são os teus números: *${pontosIndividuais}*. \n\n Qualquer coisa pode procurar por *${nome_professor}* \n\nDesejamos boa sorte e muito obrigado(a)!.`,
                                    url: "https://www.instagram.com/pev_itapebussu/p/DHt0XxxSeWO/",
                                    title: "Sorteio Projeto Ensinando a Viver",
                                }}
                                onClick={() => closeModal()}
                            >
                                <button style={{ width: '50%', height: '40px', margin: '20px auto 5px', backgroundColor: 'green' }} >Compartilhar</button>

                            </RWebShare>
                            <button style={{ width: '50%', height: '40px', margin: '0px auto 10px', backgroundColor: '#c2c2c2', color: '#000000' }} onClick={() => closeModal()} >Cancelar</button>
                        </div>

                    }

                    {show &&
                        <div>
                            <h2>Pontos da Equipe</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {vendedores.map((incident, index) =>
                                (
                                    <span key={index} style={{ fontSize: 14, alignSelf: 'flex-end' }}>{incident.nome.slice(0, 25)} - {pontosVendedores[index]} pontos</span>
                                ))}
                            </div>
                            <button onClick={() => closeModal()}>Fechar</button>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}