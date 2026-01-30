import React from 'react'

import './style.css'
import Logo from '../../assets/logo-pev.png'


export default function TelaInicial(){
    return(
        <div className='container-tela-inicial'>
            <img src={Logo} alt='Logo projeto Ensinando a Viver' />
            <h2>Frequência Online PEV</h2>
        </div>
    )
}