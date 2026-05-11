import axios from 'axios'

const api = axios.create({
    baseURL: 'https://associacaomaranataamanari.com.br/api',
    // baseURL: 'http://localhost:3333'
    headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  },
})

export default api;