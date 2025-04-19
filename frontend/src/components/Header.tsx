import React, { useState, useEffect } from "react";
import axios from "axios";

const Header: React.FC = () => {
  const [status, setStatus] = useState<"working" | "resting">("working");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Загрузка текущего статуса с бэкенда
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("/api/user/status");
        setStatus(response.data.status); // Ожидается, что бэкенд вернет { status: "working" | "resting" }
      } catch (error) {
        console.error("Ошибка при загрузке статуса:", error);
      }
    };

    fetchStatus();
  }, []);

  // Обработчик переключения статуса
  const toggleStatus = async () => {
    const newStatus = status === "working" ? "resting" : "working";
    try {
      await axios.post("/api/user/status", { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
          />
        </div>
        <div className="logo">два на два</div>
        <div className="status" onClick={toggleStatus}>
          <div
            className={`status-indicator ${
              status === "working" ? "working" : "resting"
            }`}
          ></div>
          <span className="status-text">
            {status === "working" ? "Работаю" : "Отдыхаю"}
          </span>
        </div>
      </div>
      <div className="header-right">
        <div
          className="notification-button"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          Уведомления
        </div>
        {showNotifications && (
          <div className="dropdown-menu">
            <p>Нет новых уведомлений</p>
          </div>
        )}
        <div
          className="profile-button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          Профиль
        </div>
        {showProfileMenu && (
          <div className="dropdown-menu">
            <p>Настройки</p>
            <p>Выйти</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;