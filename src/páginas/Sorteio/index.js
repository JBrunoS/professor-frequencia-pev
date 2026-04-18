import React, { useEffect, useState } from 'react'
import { FiArrowRightCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import './style.css'

import Menu from '../Menu'
import api from '../../services/api'
import BackButton from '../../components/backButton'

export default function Sorteio() {
    const [incidents, setIncidents] = useState([])
    const navigate = useNavigate()
    const id_projeto = localStorage.getItem('id_projeto')
    const id_professor = localStorage.getItem('id_professor')
    const nome_professor = localStorage.getItem('nome_professor')
    const [dataSorteio, setDataSorteio] = useState('13/06/2025')
    const [meta, setMeta] = useState(1000)
    const [vendidos, setVendidos] = useState(0)
    const [vendidosColaborador, setVendidosColaborador] = useState(0)
    const [valor, setValor] = useState(5)
    const [valorVenda, setValorVenda] = useState(0)
    const [sorteio, setSorteio] = useState('2 bicicletas e 1 iPhone 8 sem carregador')
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [telefone, setTelefone] = useState('')
    const [pontos, setPontos] = useState(0)
    const [status, setStatus] = useState()

    useEffect(() => {
        handleTotalPontos()
        handleTotalPontosVendedor()
    }, [id_projeto])

    useEffect(() => {
        handleTotalPontos()
        handleTotalPontosVendedor()
    }, [nome])

    useEffect(() => {
        setValorVenda(pontos * valor)
    }, [pontos])

    async function handleTotalPontos() {
        try {
            await api.get('/total/sorteio')
            .then(res => {
                setVendidos(res.data.count)
            })
        } catch (error) {
            
        }
    }
    async function handleTotalPontosVendedor() {
        try {
            await api.get(`/vendedor/sorteio/${id_professor}`)
            .then(res => {
                setVendidosColaborador(res.data.count)
            })
        } catch (error) {
            
        }
    }

    function handleIncrement() {
        setPontos(pontos + 1)
    }

    function handleDecrement() {
        if (pontos > 0) {
            setPontos(pontos - 1)
        } else {
            return
        }

    }

    async function handleRegister(){
        const data = 
        {
            id_projeto,
            id_professor,
            nome_professor,
            dataSorteio,
            meta,
            valorVenda,
            sorteio,
            nome,
            endereco, 
            telefone,
            pontos,
            status
        }
        

        if (nome === '') {
            alert("Preencher o nome!")    
            return
        }
        if (endereco === '') {
            alert("Preencher o endereço!")    
            return
        }
        if (telefone === '') {
            alert("Preencher o Telefone!")    
            return
        }
        if (status === '') {
            alert("Já foi pago? Favor, marcar essa opção.")    
            return
        }
        
        else{
            try {
                await api.post('/create/sorteio', data)
                .then(response => {
                    alert('Pontos gerados: ' + response.data)
                    setNome('')
                    setTelefone('')
                    setEndereco('')
                    setStatus('')
                    setPontos(0)
                    navigate('/menu-sorteio')
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
            <Menu />
            <div className='container-sorteio'>
                <BackButton to="/menu-sorteio" label="Voltar para Menu Anterior" />
                <span>Sorteio: {sorteio} </span>
                <span>Data: {dataSorteio} </span>
                <div>
                    <span>Meta: {meta} pont. </span>
                    <span>Valor: R$ {valor},00</span>
                </div>

                <div>
                    <span>Vend. Geral: {vendidos}</span>
                    <span>{nome_professor.slice(0, 12)}: {vendidosColaborador} </span>
                </div>



                <form>
                    <input placeholder='Nome e Sobrenome' value={nome} onChange={e => setNome(e.target.value)} />
                    <input placeholder='Endereço e distrito' value={endereco} onChange={e => setEndereco(e.target.value)} />
                    <input placeholder='Telefone' value={telefone} onChange={e => setTelefone(e.target.value)} />
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="">Já foi pago?</option>
                        <option value={1}>Pago</option>
                        <option value={0}>Não Pago</option>
                    </select>

                    <div>
                        <button type='button' onClick={() => handleDecrement()}>-</button>
                        <span>{pontos}</span>
                        <button type='button' onClick={() => handleIncrement()}>+</button>
                    </div>

                    <span>R$ {valorVenda},00</span>

                    <button type='button' disabled={pontos === 0 ? true : false} onClick={() => handleRegister()}>Enviar</button>
                </form>
            </div>
        </>
    )
}