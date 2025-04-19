import React, { useState, useRef, useEffect } from "react";
import "./styles/index.css";

// Иконки FontAwesome CDN (лучше через npm, но для простоты — через <link>)
const FontAwesomeLink = () => (
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
);

const initialProjects = [
  { name: "Проект 1" },
  { name: "Проект 2" },
  { name: "Проект 3" },
];

const App: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [projectsModal, setProjectsModal] = useState(false);
  const [projectForm, setProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [tasksModal, setTasksModal] = useState(false);
  const [tasksTitle, setTasksTitle] = useState("ЗАДАЧИ ПРОЕКТА");
  const [statusWorking, setStatusWorking] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setSearchActive(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddProject = () => {
    if (projectName.trim()) {
      setProjects([...projects, { name: projectName.trim() }]);
      setProjectName("");
      setProjectForm(false);
    }
  };

  const handleProjectClick = (name: string) => {
    setTasksTitle(`ЗАДАЧИ: ${name}`);
    setTasksModal(true);
    setProjectsModal(false);
  };

  return (
    <>
      <FontAwesomeLink />
      <div className="layout">
        {/* Боковая панель */}
        <div className="sidebar">
          <div className="sidebar-menu">
            <a
              href="#"
              className="sidebar-item"
              onClick={e => {
                e.preventDefault();
                setProjectsModal(true);
              }}
            >
              <i className="fas fa-project-diagram sidebar-icon"></i>
              <span className="sidebar-text">Проекты</span>
            </a>
            <a href="#" className="sidebar-item">
              <i className="fas fa-chart-line sidebar-icon"></i>
              <span className="sidebar-text">Статистика</span>
            </a>
            <a href="#" className="sidebar-item">
              <i className="fas fa-users sidebar-icon"></i>
              <span className="sidebar-text">Сотрудники</span>
            </a>
          </div>
        </div>
        {/* Основное содержимое */}
        <div className="main-content">
          <header className="header">
            <div
              className={`search-container${searchActive ? " active" : ""}`}
              ref={searchRef}
            >
              <div
                className="search-btn"
                onClick={e => {
                  e.stopPropagation();
                  setSearchActive(a => !a);
                }}
              >
                <i className="fas fa-search"></i>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="Поиск..."
                onChange={e => console.log("Поиск:", e.target.value)}
              />
            </div>
            <div className="logo">два на два</div>
            <div className="header-right">
              <div
                className="notifications"
                ref={notificationsRef}
                onClick={e => {
                  e.stopPropagation();
                  setNotificationsOpen(o => !o);
                  setAccountMenuOpen(false);
                }}
              >
                <i className="fas fa-bell"></i>
                <div className="notification-badge">3</div>
                <div
                  className={`notifications-panel${notificationsOpen ? " show" : ""}`}
                >
                  <div className="notification-header">
                    <div className="notification-title">Уведомления</div>
                    <div
                      className="notification-close"
                      onClick={e => {
                        e.stopPropagation();
                        setNotificationsOpen(false);
                      }}
                    >
                      &times;
                    </div>
                  </div>
                  <div className="notification-item">
                    <div>Новое сообщение от пользователя</div>
                    <div className="notification-time">5 минут назад</div>
                  </div>
                  <div className="notification-item">
                    <div>Задача выполнена успешно</div>
                    <div className="notification-time">2 часа назад</div>
                  </div>
                  <div className="notification-item">
                    <div>Система обновлена до версии 2.0</div>
                    <div className="notification-time">Вчера, 14:30</div>
                  </div>
                </div>
              </div>
              <div
                className="account"
                ref={accountMenuRef}
                onClick={e => {
                  e.stopPropagation();
                  setAccountMenuOpen(o => !o);
                  setNotificationsOpen(false);
                }}
              >
                <i className="fas fa-user account-icon"></i>
                <div className={`account-menu${accountMenuOpen ? " show" : ""}`}>
                  <div className="account-menu-item">Профиль</div>
                  <div className="account-menu-item">Настройки</div>
                  <div className="account-menu-item">
                    <a
                      href="register.html"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Регистрация
                    </a>
                  </div>
                  <div className="account-menu-item">Выйти</div>
                </div>
              </div>
              <div
                className={`status ${statusWorking ? "status-working" : "status-resting"}`}
                onClick={() => setStatusWorking(w => !w)}
                id="statusButton"
              >
                <div className="status-indicator"></div>
                <span className="status-text">
                  {statusWorking ? "Работаю" : "Отдыхаю"}
                </span>
              </div>
            </div>
          </header>
          <main>
            {/* Здесь будет основной контент */}
          </main>
        </div>
      </div>
      {/* Модальное окно проектов */}
      <div className={`projects-modal${projectsModal ? " show" : ""}`}>
        <div className="projects-header">
          <div className="projects-title">ПРОЕКТЫ</div>
          <div
            className="projects-close"
            onClick={() => setProjectsModal(false)}
          >
            &times;
          </div>
        </div>
        <div className="projects-list">
          {projects.map((project, idx) => (
            <div
              className="project-item"
              key={idx}
              onClick={() => handleProjectClick(project.name)}
            >
              <div className="project-name">{project.name}</div>
            </div>
          ))}
          <div
            className="add-project"
            onClick={() => setProjectForm(true)}
          >
            <i className="fas fa-plus add-project-icon"></i>
            <span className="add-project-text">Добавить проект</span>
          </div>
        </div>
        <div className={`project-form${projectForm ? " show" : ""}`}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Название проекта"
            />
          </div>
          <div className="form-actions">
            <button
              className="form-btn cancel"
              onClick={() => {
                setProjectForm(false);
                setProjectName("");
              }}
            >
              Отмена
            </button>
            <button className="form-btn save" onClick={handleAddProject}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
      {/* Модальное окно задач проекта */}
      <div className={`tasks-modal${tasksModal ? " show" : ""}`}>
        <div className="tasks-header">
          <div className="tasks-title">{tasksTitle}</div>
          <div
            className="tasks-close"
            onClick={() => setTasksModal(false)}
          >
            &times;
          </div>
        </div>
        <div className="tasks-container">
          {/* Пример одного столбца */}
          <div className="task-column">
            <div className="task-column-header">
              <div className="task-column-title">Новые</div>
              <div className="task-column-toggle">▼</div>
            </div>
            <div className="task-list">
              <div className="task-item">
                <div className="task-name">Задача 1</div>
                <div className="task-description">Описание задачи 1</div>
                <div className="task-footer">
                  <span>Сегодня</span>
                  <span>Низкий</span>
                </div>
              </div>
              <div className="task-item">
                <div className="task-name">Задача 2</div>
                <div className="task-description">Описание задачи 2</div>
                <div className="task-footer">
                  <span>Завтра</span>
                  <span>Средний</span>
                </div>
              </div>
            </div>
          </div>
          {/* Кнопка добавления столбца */}
          <div className="add-column">
            <i className="fas fa-plus add-column-icon"></i>
            <span className="add-column-text">Добавить столбец</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;