import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PrivateRoute from './routes/PrivateRoute'

import Home from './páginas/Home'
import Turnos from './páginas/Turnos'
import Turma from './páginas/Turma'
import Turmas from './páginas/Turmas'
import Participantes from './páginas/Participantes'
import Login from './páginas/Login'
import HistoricoFrequencia from './páginas/HistoricoFrequencia'
import HistoricoFrequenciaDetalhes from './páginas/HistoricoFrequenciaDetalhes'
import Frequencia from './páginas/Frequencia'
import Sementinha from './páginas/Sementinha'
import Estoque from './páginas/Estoque'
import Papagaios from './páginas/papagaios'
import Sorteio from './páginas/Sorteio'
import SorteioMenu from './páginas/sorteioMenu'
import Autorizacao from './páginas/Autorizacao'
import NovaAutorizacao from './páginas/NovaAutorização'
import AutorizacaoDetalhes from './páginas/AutorizacaoDetalhes'
import Loja from './páginas/Loja'

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />

                <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path='/participantes' element={<PrivateRoute><Participantes /></PrivateRoute>} />
                <Route path='/turma' element={<PrivateRoute><Turma /></PrivateRoute>} />
                <Route path='/turmas' element={<PrivateRoute><Turmas /></PrivateRoute>} />
                <Route path='/estoque' element={<PrivateRoute><Estoque /></PrivateRoute>} />
                <Route path='/turnos' element={<PrivateRoute><Turnos /></PrivateRoute>} />
                <Route path='/frequencia' element={<PrivateRoute><Frequencia /></PrivateRoute>} />
                <Route path='/historico' element={<PrivateRoute><HistoricoFrequencia /></PrivateRoute>} />
                <Route path='/listaPresenca' element={<PrivateRoute><HistoricoFrequenciaDetalhes /></PrivateRoute>} />
                <Route path='/sementinha' element={<PrivateRoute><Sementinha /></PrivateRoute>} />
                <Route path='/papagaios' element={<PrivateRoute><Papagaios /></PrivateRoute>} />
                <Route path='/sorteio' element={<PrivateRoute><Sorteio /></PrivateRoute>} />
                <Route path='/menu-sorteio' element={<PrivateRoute><SorteioMenu /></PrivateRoute>} />
                <Route path='/autorizacao' element={<PrivateRoute><Autorizacao /></PrivateRoute>} />
                <Route path='/autorizacao/nova' element={<PrivateRoute><NovaAutorizacao /></PrivateRoute>} />
                <Route path='/autorizacao/:id' element={<PrivateRoute><AutorizacaoDetalhes /></PrivateRoute>} />
                <Route path='/loja' element={<PrivateRoute><Loja /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}
