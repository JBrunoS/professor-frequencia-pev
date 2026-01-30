import axios from 'axios'

const api = axios.create({
    baseURL: 'http://associacaomaranataamanari.com.br:21010'
    // baseURL: 'http://localhost:3333'
})

export default api;