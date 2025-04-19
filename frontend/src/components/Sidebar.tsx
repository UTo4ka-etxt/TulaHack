import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/" className="sidebar-item">
          <i className="fas fa-home sidebar-icon"></i>
          <span className="sidebar-text">Главная</span>
        </Link>
        <Link to="/projects" className="sidebar-item">
          <i className="fas fa-project-diagram sidebar-icon"></i>
          <span className="sidebar-text">Проекты</span>
        </Link>
        <Link to="/tasks" className="sidebar-item">
          <i className="fas fa-tasks sidebar-icon"></i>
          <span className="sidebar-text">Задачи</span>
        </Link>
        <Link to="/team" className="sidebar-item">
          <i className="fas fa-users sidebar-icon"></i>
          <span className="sidebar-text">Команда</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;