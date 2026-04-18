import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../../assets/logo-pev.png";
import api from "../../services/api";

import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    
    setLoading(true);
    
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

      alert(`Seja bem-vindo "${response.data[0].nome}"`);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Erro ao tentar fazer login");
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container-login">
      <div className="content-login">
        <div className="img">
          <img src={Logo} alt="projeto ensinando a viver" />
          <span>Frequência Professor</span>
        </div>
        <form onSubmit={handleLogin} className="login">
          <span>Email</span>
          <div className="login-email">
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <span>Senha</span>
          <div className="login-senha">
            <div>
              <input
                type={isVisible ? "text" : "password"}
                placeholder="**********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setIsVisible(!isVisible)}
                type="button"
              >
                {isVisible ? (
                  <FiEyeOff size={20} color="#9b9b9b" />
                ) : (
                  <FiEye size={20} color="#9b9b9b" />
                )}
              </button>
            </div>
          </div>

          <div className="buttons">
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
