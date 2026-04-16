import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/logo-pev.png";
import api from "../../services/api";

import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleLogin() {
    const data = { email, senha };

    try {
      const response = await api.post("/professor/login", data);

      if (response.data.length === 0) {
        alert("Não encontramos ninguém com essas informações");
        return;
      }

      localStorage.setItem("id_professor", response.data[0].id);
      localStorage.setItem("id_projeto", response.data[0].id_projeto);
      localStorage.setItem("nome_professor", response.data[0].nome);
      localStorage.setItem("funcao_professor", response.data[0].funcao);
      localStorage.setItem("image_url", response.data[0].image_url);

      alert(`Seja bem-vindo "${response.data[0].nome}"`);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao tentar fazer login");
    }
  }

  return (
    <div className="container-login">
      <div className="img">
        <h2>Frequência Online</h2>
        <h2>Projeto Ensinando a Viver</h2>
        <img src={Logo} alt="projeto ensinando a viver" />
        <p>Frequência On-line</p>
      </div>
      <div className="login">
        <div className="login-email">
          <label>Nome/Email</label>
          <input
            type="email"
            placeholder="Digite aqui..."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-senha">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite aqui..."
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button>Cancelar</button>
          <button onClick={() => handleLogin()}>Entrar</button>
        </div>
      </div>
    </div>
  );
}
