import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from "react-toastify";

import Logo from "../../assets/logo-pev.png";
import api from "../../services/api";

import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    senha: ""
  });

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    let newErrors = { email: "", senha: "" };

    if (!email) newErrors.email = "Email é obrigatório";
    if (!senha) newErrors.senha = "Senha é obrigatória";

    if (newErrors.email || newErrors.senha) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/professor/login", { email, senha });

      const user = response.data;

      localStorage.setItem("id_professor", user.id);
      localStorage.setItem("id_projeto", user.id_projeto);
      localStorage.setItem("nome_professor", user.nome);
      localStorage.setItem("funcao_professor", user.funcao);
      localStorage.setItem("image_url", user.image_url);
      toast.success(`Seja bem-vindo, ${user.nome}`)
      navigate("/");
    } catch (error) {
      const err = error.response?.data?.error;

      if (err === "EMAIL_INVALIDO") {
        setErrors({ email: "Email inválido ou não encontrado", senha: "" });
      } else if (err === "SENHA_INVALIDA") {
        setErrors({ email: "", senha: "Senha inválida ou incorreta" });
      } else {
        setErrors({ email: "", senha: "Erro ao fazer login" });
      }
    } finally {
      setLoading(false);

    }
  }

  return (
    <div className="container-login">
      <div className="content-login">
        <div className="img">
          <img src={Logo} alt='projeto ensinando a viver' />
          <span>Frequência Professor</span>
        </div>
        <form onSubmit={handleLogin} className="login">
          <span>Email</span>
          <div className="login-email">
            <input
              type='email'
              placeholder="email@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}

              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <span>Senha</span>
          <div className="login-senha">
            <div>
              <input
                type={isVisible ? 'text' : 'password'}
                placeholder="**********"
                value={senha}
                onChange={e => setSenha(e.target.value)}

                className={errors.senha ? "error-input" : ""}
              />
              <button
                aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setIsVisible(!isVisible)}
                type='button'
              >
                {isVisible ?
                  <FiEyeOff size={20} color="#9b9b9b" /> :
                  <FiEye size={20} color="#9b9b9b" />
                }
              </button>
            </div>
            {errors.senha && <span className="error">{errors.senha}</span>}

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
