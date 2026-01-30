import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiLoader, FiDollarSign } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import Menu from '../Menu'
import api from '../../services/api'

import './style.css'

export default function Papagaios() {
    const id_projeto = localStorage.getItem('id_projeto')
    const [incidents, setIncidents] = useState([])
    const [nome, setNome] = useState('')
    const [id_participante, setIdParticipante] = useState('')
    const [br, setBr] = useState('')
    const [valor, setValor] = useState('')
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const [estado, setEstado] = useState(false) 
    const [frequencia, setFrequencia] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        handleIncidentsAlunos()
    }, [])
    
    useEffect(() => {
        handleSaldo()
    }, [nome])

    async function handleSaldo() {

        if (!id_projeto) {
            return
        }

        if (nome === '') {
            return
        } else {
            try {
                await api.get(`/get/frequencia-aluno/${id_participante}/${month}/${year}`)
                    .then(response => {
                        setFrequencia(response.data)
                        console.log(response.data)
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }
    
    async function handleIncidentsAlunos() {

        if (!id_projeto) {
            return
        }

        try {
            await api.get(`/participantes/${id_projeto}`)
                .then(response => {
                    setIncidents(response.data)
                })
        } catch (error) {
            console.log(error)
        }
    }


    function handleBack() {


        frequencia.length = 0
        navigate('/')
    }

    async function handleSalvar() {

        if(valor == '' || nome == ''){
            alert("Preecher os campos acima para continuar.")
            return
        }

        setEstado(true)
        let valorN = parseInt(valor)
        const data = {
            valor: valorN,
            id: id_participante
        }

        try {
            
            await api.put('/desconta/papagaio', data)
                .then(response => {
                    alert(response.data)
                    setEstado(false)
                    frequencia.length = 0
                    
                    setValor('')
                })
        } catch (error) {
            console.log(error)
        }

        handleSaldo()
    }

    const options = incidents.map((option) => {
        const faixa = option.faixa;
        return {
            faixa,
            ...option,
        };
    });
    return (
        <>
            <Menu />
            <div className='container-loja'>
                <div className={estado ? "loja-modal-load" : "loja-modal-loaded"}>
                    <FiLoader size={50} color='#f19864' />Aguarde...
                </div>
                
                <FiArrowLeft onClick={() => handleBack()} size={30} color='#000000' />
                
                <span>Loja do PEV</span>

                <Autocomplete
                    id="grouped-demo"
                    options={options.sort((a, b) => -b.faixa.localeCompare(a.faixa))}
                    groupBy={(option) => option.faixa}
                    getOptionLabel={(option) => (option.br + ' - ' + option.nome)}
                    isOptionEqualToValue={(option, value) =>
                        option.faixa === value.faixa
                    }
                    sx={{ width: '100%' }}
                    onChange={(event, newValue) => {
                        setNome(newValue.nome)
                        setIdParticipante(newValue.id)
                        setBr(newValue.br)

                    }}

                    renderInput={(params) => <TextField {...params} label="Digite um nome" />}
                />
                <span> {frequencia.length ? "Saldo Papagaios: " + frequencia[0].saldo : ''}</span>

                <div>
                    <label>Valor Gasto</label>
                    <input type='number' value={valor} onChange={e => setValor(parseInt(e.target.value))} />
                </div>


                <button className='descontar' type='button' onClick={() => handleSalvar()}>Descontar <FiDollarSign size={30} color='#FFF' /></button>
            </div>
        </>
    )
}