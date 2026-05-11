import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiUsers,
  FiLogOut,
  FiClipboard,
  FiHome,
  FiEdit2,
  FiLock,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import "./style.css";
import user_image from "../../assets/user_image.png";
import { isAdmin } from "../../utils/roles";

export default function Menu() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const funcao_professor = localStorage.getItem("funcao_professor") || "";
  const image_url = localStorage.getItem("image_url");

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  function goTo(path) {
    navigate(path);
    setOpen(true);
  }

  function handleSair() {
    [
      "nome_turma",
      "id_professor",
      "id_projeto",
      "turno_turma",
      "nome_professor",
      "funcao_professor",
    ].forEach((item) => localStorage.removeItem(item));
    toast.info("Usuário deslogado!");
    navigate("/login", { replace: true });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="container-menu">
      <div onClick={toggleMenu}>
        <FiMenu size={30} color="#FFFFFF" />
      </div>

      <div>
        <span>PEV - Educacional</span>
      </div>

      <div className="foto-editavel">
        <img
          src={!image_url || image_url === "null" ? user_image : image_url}
          alt="Perfil de usuário"
        />
        {/* <button className="icone-editar">
          <FiEdit2 size={14} />
        </button> */}
      </div>
      {!open && <div className="overlay" onClick={toggleMenu} />}
      <div className={open ? "suspenso-menu-off" : "suspenso-menu"}>
        <span onClick={toggleMenu} className="menu-item">
          <FiX size={30} color="#FFFFFF" />
          Fechar
        </span>
        <span
          className={isActive("/") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/")}
        >
          <FiHome size={20} />
          Home
        </span>
        {isAdmin(funcao_professor) && (
          <span
            className={
              isActive("/autorizacao") ? "menu-item active" : "menu-item"
            }
            onClick={() => goTo("/autorizacao")}
          >
            <FiLock size={20} />
            Autorizações
          </span>
        )}

        <span
          className={isActive("/turmas") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/turmas")}
        >
          <FiUsers size={20} />
          Frequência
        </span>

        <span
          className={
            isActive("/participantes") ? "menu-item active" : "menu-item"
          }
          onClick={() => goTo("/participantes")}
        >
          <FiUser size={20} />
          Participantes
        </span>

        <span
          className={isActive("/estoque") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/estoque")}
        >
          <FiClipboard size={20} />
          Registro de Consumo
        </span>

        <span
          className={isActive("/loja") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/loja")}
        >
          <FiDollarSign size={20} />
          Loja Papagaio
        </span>
        <div className="section-profile">
          <span
            className="menu-item logout"
            onClick={() => toast.info("Funcionalidade em desenvolvimento")}
          >
            <FiEdit2 size={20} />
            Alterar senha
          </span>
          <span className="menu-item logout" onClick={handleSair}>
            <FiLogOut size={20} />
            Sair
          </span>
        </div>
      </div>
    </div>
  );
}
