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
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

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

    navigate("/login", { replace: true });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="container-menu">
      <div onClick={toggleMenu}>
        {open ? (
          <FiMenu size={30} color="#FFFFFF" />
        ) : (
          <FiX size={30} color="#FFFFFF" />
        )}
      </div>

      <div>
        <span>PEV - Educacional</span>
      </div>

      <div className="foto-editavel">
        <img
          src={image_url === null ? user_image : image_url}
          alt="Perfil de usuário"
        />
        {/* <button className="icone-editar">
          <FiEdit2 size={14} />
        </button> */}
      </div>

      <div className={open ? "suspenso-menu-off" : "suspenso-menu"}>
        <span
          className={isActive("/") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/")}
        >
          <FiHome size={20} />
          Home
        </span>

        <span
          className={isActive("/participantes") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/participantes")}
        >
          <FiUser size={20} />
          Participantes
        </span>

        <span
          className={isActive("/turmas") ? "menu-item active" : "menu-item"}
          onClick={() => goTo("/turmas")}
        >
          <FiUsers size={20} />
          Frequência
        </span>

        {isAdmin(funcao_professor) && (
          <span
            className={isActive("/estoque") ? "menu-item active" : "menu-item"}
            onClick={() => goTo("/estoque")}
          >
            <FiClipboard size={20} />
            Estoque
          </span>
        )}

        <span className="menu-item logout" onClick={handleSair}>
          <FiLogOut size={20} />
          Sair
        </span>
      </div>
    </div>
  );
}
