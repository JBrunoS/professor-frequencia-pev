import axios from 'axios'

const api = axios.create({
    baseURL: 'https://associacaomaranataamanari.com.br/api'
    // baseURL: 'http://localhost:3333'
})

export default api;