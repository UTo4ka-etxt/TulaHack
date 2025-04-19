import React, { useState, useRef, useEffect } from "react";
import "./styles/index.css";

// Подключение Chart.js
import Chart from "chart.js/auto";

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

const initialEmployees = [
  { name: "Иван Иванов", role: "Разработчик" },
  { name: "Мария Петрова", role: "Дизайнер" },
  { name: "Алексей Сидоров", role: "Менеджер" }
];

const App: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [projectsModal, setProjectsModal] = useState(false);
  const [projectForm, setProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [statsModal, setStatsModal] = useState(false);
  const [statsTab, setStatsTab] = useState<"tasks" | "projects" | "time">("tasks");
  const [tasksTab, setTasksTab] = useState<"active" | "completed">("active");
  const [employeesModal, setEmployeesModal] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const [employeeForm, setEmployeeForm] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [editEmployeeIdx, setEditEmployeeIdx] = useState<number | null>(null);
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

  // Chart.js инициализация
  useEffect(() => {
    if (statsModal) {
      setTimeout(() => {
        if (statsTab === "projects") {
          const ctx = document.getElementById("projectsChart") as HTMLCanvasElement;
          if (ctx && !ctx.dataset.rendered) {
            new Chart(ctx, {
              type: "doughnut",
              data: {
                labels: ["Активные", "Завершенные"],
                datasets: [{
                  data: [75, 25],
                  backgroundColor: ["#4CAF50", "#9E9E9E"],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: { legend: { position: "bottom" } }
              }
            });
            ctx.dataset.rendered = "true";
          }
        }
        if (statsTab === "time") {
          const ctx = document.getElementById("timeChart") as HTMLCanvasElement;
          if (ctx && !ctx.dataset.rendered) {
            new Chart(ctx, {
              type: "bar",
              data: {
                labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
                datasets: [{
                  label: "Часы",
                  data: [6, 7, 8, 5, 6, 0, 0],
                  backgroundColor: "#4CAF50",
                  borderRadius: 4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }
            });
            ctx.dataset.rendered = "true";
          }
        }
      }, 100);
    }
  }, [statsModal, statsTab]);

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

  // Добавление/редактирование сотрудника
  const handleSaveEmployee = () => {
    if (employeeName.trim() && employeeRole.trim()) {
      if (editEmployeeIdx !== null) {
        const updated = [...employees];
        updated[editEmployeeIdx] = { name: employeeName, role: employeeRole };
        setEmployees(updated);
      } else {
        setEmployees([...employees, { name: employeeName, role: employeeRole }]);
      }
      setEmployeeForm(false);
      setEmployeeName("");
      setEmployeeRole("");
      setEditEmployeeIdx(null);
    }
  };

  // Удаление сотрудника
  const handleDeleteEmployee = (idx: number) => {
    setEmployees(employees.filter((_, i) => i !== idx));
  };

  // Открытие формы редактирования сотрудника
  const handleEditEmployee = (idx: number) => {
    setEmployeeName(employees[idx].name);
    setEmployeeRole(employees[idx].role);
    setEditEmployeeIdx(idx);
    setEmployeeForm(true);
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
            <a
              href="#"
              className="sidebar-item"
              onClick={e => {
                e.preventDefault();
                setStatsModal(true);
              }}
            >
              <i className="fas fa-chart-line sidebar-icon"></i>
              <span className="sidebar-text">Статистика</span>
            </a>
            <a
              href="#"
              className="sidebar-item"
              onClick={e => {
                e.preventDefault();
                setEmployeesModal(true);
              }}
            >
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
      {/* Модальное окно статистики */}
      {statsModal && (
        <div className="stats-modal show" onClick={e => { if (e.target === e.currentTarget) setStatsModal(false); }}>
          <div>
            <div className="stats-header">
              <div className="stats-title">СТАТИСТИКА</div>
              <div className="stats-close" onClick={() => setStatsModal(false)}>&times;</div>
            </div>
            <div className="stats-tabs">
              <div className={`stats-tab${statsTab === "tasks" ? " active" : ""}`} onClick={() => setStatsTab("tasks")}>Задачи</div>
              <div className={`stats-tab${statsTab === "projects" ? " active" : ""}`} onClick={() => setStatsTab("projects")}>Проекты</div>
              <div className={`stats-tab${statsTab === "time" ? " active" : ""}`} onClick={() => setStatsTab("time")}>Время</div>
            </div>
            <div className="stats-content">
              {statsTab === "tasks" && (
                <div className="stats-pane active">
                  <div className="tasks-tabs">
                    <div className={`tasks-tab${tasksTab === "active" ? " active" : ""}`} onClick={() => setTasksTab("active")}>Активные</div>
                    <div className={`tasks-tab${tasksTab === "completed" ? " active" : ""}`} onClick={() => setTasksTab("completed")}>Завершенные</div>
                  </div>
                  <div className="tasks-content">
                    {tasksTab === "active" ? (
                      <div className="tasks-pane active">
                        <div className="task-item">
                          <div className="task-name">Разработать главную страницу</div>
                          <div className="task-info">Проект: Сайт компании</div>
                          <div className="task-deadline">Срок: 15.05.2023</div>
                        </div>
                        <div className="task-item">
                          <div className="task-name">Написать API для сервиса</div>
                          <div className="task-info">Проект: Мобильное приложение</div>
                          <div className="task-deadline">Срок: 20.05.2023</div>
                        </div>
                      </div>
                    ) : (
                      <div className="tasks-pane active">
                        <div className="task-item completed">
                          <div className="task-name">Дизайн логотипа</div>
                          <div className="task-info">Проект: Брендинг</div>
                          <div className="task-completed">Завершено: 10.04.2023</div>
                        </div>
                        <div className="task-item completed">
                          <div className="task-name">Тестирование модуля</div>
                          <div className="task-info">Проект: Внутренняя система</div>
                          <div className="task-completed">Завершено: 05.04.2023</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {statsTab === "projects" && (
                <div className="stats-pane active">
                  <div className="stats-chart">
                    <canvas id="projectsChart"></canvas>
                  </div>
                  <div className="stats-summary">
                    <div className="summary-item">
                      <div className="summary-value">5</div>
                      <div className="summary-label">Всего проектов</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-value">3</div>
                      <div className="summary-label">Активных</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-value">2</div>
                      <div className="summary-label">Завершено</div>
                    </div>
                  </div>
                </div>
              )}
              {statsTab === "time" && (
                <div className="stats-pane active">
                  <div className="stats-chart">
                    <canvas id="timeChart"></canvas>
                  </div>
                  <div className="time-stats">
                    <div className="time-stat">
                      <div className="time-value">32</div>
                      <div className="time-label">Часов на этой неделе</div>
                    </div>
                    <div className="time-stat">
                      <div className="time-value">7.2</div>
                      <div className="time-label">Среднее в день</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно сотрудников */}
      {employeesModal && (
        <div className="employees-modal show" onClick={e => { if (e.target === e.currentTarget) setEmployeesModal(false); }}>
          <div>
            <div className="employees-header">
              <div className="employees-title">Сотрудники</div>
              <div className="employees-close" onClick={() => setEmployeesModal(false)}>&times;</div>
            </div>
            <div className="employees-list">
              {employees.map((employee, idx) => (
                <div className="employee-item" key={idx}>
                  <div>
                    <div className="employee-name">{employee.name}</div>
                    <div className="employee-role">{employee.role}</div>
                  </div>
                  <div className="employee-actions">
                    <span className="employee-action edit" onClick={() => handleEditEmployee(idx)}>Редактировать</span>
                    <span className="employee-action delete" onClick={() => handleDeleteEmployee(idx)}>Удалить</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`employee-form${employeeForm ? " show" : ""}`}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={employeeName}
                  onChange={e => setEmployeeName(e.target.value)}
                  placeholder="Имя сотрудника"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={employeeRole}
                  onChange={e => setEmployeeRole(e.target.value)}
                  placeholder="Должность"
                />
              </div>
              <div className="form-actions">
                <button className="form-btn cancel" onClick={() => setEmployeeForm(false)}>Отмена</button>
                <button className="form-btn save" onClick={handleSaveEmployee}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}
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