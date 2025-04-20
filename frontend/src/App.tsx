import React, { useState, useRef, useEffect } from "react";
import "./styles/index.css";
import Chart from "chart.js/auto";

// FontAwesome CDN
const FontAwesomeLink = () => (
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
);

const sidebarItems = [
  { icon: "fa-gear", label: "настройки" },
  { icon: "fa-diagram-project", label: "проекты" },
  { icon: "fa-chart-line", label: "статистика" },
  { icon: "fa-id-card", label: "команда" }
];

const initialEmployees = [
  { name: "Петров Петр", role: "junior web разработчик" },
  { name: "Иванов Иван", role: "junior ux/ui дизайнер" },
  { name: "Романов Роман", role: "аналитик" }
];

const App: React.FC = () => {
  const [projects, setProjects] = useState([
    {
      name: "Проект 1",
      date: "2025-06-15",
      tasks: [
        { id: 1, title: "Задача 1", status: "new" },
        { id: 2, title: "Задача 2", status: "in_progress" },
        { id: 3, title: "Задача 3", status: "done" }
      ],
      team: ["Петров Петр", "Иванов Иван"],
      comments: ["Комментарий 1", "Комментарий 2"]
    },
    {
      name: "Проект 2",
      date: "2025-06-20",
      tasks: [
        { id: 4, title: "Задача 4", status: "new" }
      ],
      team: ["Романов Роман"],
      comments: []
    },
    {
      name: "Проект 3",
      date: "2025-06-25",
      tasks: [],
      team: [],
      comments: []
    }
  ]);
  const [activeProject, setActiveProject] = useState(0);
  const [projectsModal, setProjectsModal] = useState(false);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [statsModal, setStatsModal] = useState(false);
  const [statsTab, setStatsTab] = useState<"tasks" | "projects" | "time">("tasks");
  const [employeesModal, setEmployeesModal] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const [employeeForm, setEmployeeForm] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [editEmployeeIdx, setEditEmployeeIdx] = useState<number | null>(null);
  const [status, setStatus] = useState(true);
  const [taskEdit, setTaskEdit] = useState<null | {mode: "add"|"edit", status: "new"|"in_progress"|"done", value: string, id: number|null}>(null);

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

  // Добавление проекта
  const handleAddProject = () => {
    if (projectName.trim()) {
      setProjects([
        ...projects,
        {
          name: projectName.trim(),
          date: new Date().toISOString().slice(0, 10),
          tasks: [],
          team: [],
          comments: []
        }
      ]);
      setProjectName("");
      setProjectForm(false);
    }
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
      <div className="main-bg">
        {/* Сайдбар */}
        <aside className="sidebar">
          {sidebarItems.map((item, idx) => (
            <div
              className="sidebar-item"
              key={idx}
              onClick={() => {
                if (item.label === "проекты") setProjectsModal(true);
                else if (item.label === "статистика") setStatsModal(true);
                else if (item.label === "команда") setEmployeesModal(true);
              }}
            >
              <i className={`fa-solid ${item.icon} sidebar-icon`} />
              <span className="sidebar-text">{item.label}</span>
            </div>
          ))}
        </aside>

        {/* Контент */}
        <div className="main-inner">
          {/* Шапка */}
          <header className="header">
            <div className="logo">2NA2S</div>
            <div className="header-right">
              <span className="status">{status ? "Работаю" : "Отдыхаю"}</span>
              <i className="fa-regular fa-user account-icon" />
              <i className="fa-regular fa-bell notifications" />
            </div>
          </header>

          {/* Заголовок */}
          <h1 className="main-title">ЗАДАЧИ</h1>

          {/* Проекты */}
          <div className="projects-row">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`project-pill${idx === activeProject ? " active" : ""}`}
                onClick={() => setActiveProject(idx)}
                style={{
                  minWidth: 180,
                  minHeight: 48,
                  background: idx === 0 ? "#bfe5c6" : idx === 1 ? "#ffe0a3" : idx === 2 ? "#ffffb5" : "#f3f3f3",
                  color: idx === activeProject ? "#fff" : "#222",
                  boxShadow: idx === activeProject ? "0 4px 18px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.08)",
                  fontWeight: idx === activeProject ? 600 : 500,
                  border: "none"
                }}
              >
                {project.name}
              </div>
            ))}
          </div>

          <div className="tasks-columns-row">
            {projects.map((project, idx) => (
              <div
                className="tasks-column-main"
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 28,
                  minWidth: 240,
                  minHeight: 260,
                  marginTop: 8,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 20,
                    margin: "18px 0 10px 0",
                    color: idx === activeProject ? "#5bbd6b" : "#222"
                  }}
                >
                  {project.name}
                </div>
                <div style={{width: "90%", minHeight: 40}}>
                  {project.tasks && project.tasks.filter(t => t.status === "new" || t.status === "in_progress").length > 0 ? (
                    <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                      {project.tasks
                        .filter(t => t.status === "new" || t.status === "in_progress")
                        .map(t => (
                          <li key={t.id} style={{
                            background: "#f6fcff",
                            borderRadius: 12,
                            margin: "8px 0",
                            padding: "10px 14px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            fontSize: 16,
                            color: "#222",
                            display: "flex",
                            alignItems: "center"
                          }}>
                            {t.title}
                            {t.status === "in_progress" && (
                              <span style={{marginLeft: 8, color: "#bfaee5", fontWeight: 500, fontSize: 14}}>(в работе)</span>
                            )}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div style={{color: "#bbb", fontSize: 15, marginTop: 16}}>Нет активных задач</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно проектов */}
      {projectsModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setProjectsModal(false); }}>
          <div className="modal modal-projects">
            <h1 className="modal-title">ПРОЕКТЫ</h1>
            <div className="modal-list">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className="modal-list-item"
                  onClick={() => {
                    setSelectedProjectIdx(idx);
                    setProjectsModal(false);
                  }}
                >
                  {project.name}
                </div>
              ))}
              <button className="modal-list-item add" onClick={() => setProjectForm(true)}>
                <i className="fa-solid fa-plus"></i> Новый проект
              </button>
            </div>
            {projectForm && (
              <div className="modal-form">
                <input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Название проекта"
                />
                <button onClick={handleAddProject}>Добавить</button>
                <button onClick={() => setProjectForm(false)}>Отмена</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно сотрудников */}
      {employeesModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEmployeesModal(false); }}>
          <div className="modal modal-employees">
            <h1 className="modal-title">СОТРУДНИКИ</h1>
            <div className="modal-list">
              {employees.map((emp, idx) => (
                <div className="modal-list-item employee" key={idx}>
                  <span className="employee-avatar"></span>
                  <span className="employee-name">{emp.name}</span>
                  <span className="employee-role">({emp.role})</span>
                  <button
                    className="employee-edit"
                    onClick={() => handleEditEmployee(idx)}
                    title="Редактировать"
                  >✏️</button>
                  <button
                    className="employee-delete"
                    onClick={() => handleDeleteEmployee(idx)}
                    title="Удалить"
                  >🗑️</button>
                </div>
              ))}
              <button className="modal-list-item add" onClick={() => setEmployeeForm(true)}>
                <span className="employee-add-plus">+</span> Добавить сотрудника
              </button>
              {employeeForm && (
                <div className="modal-form">
                  <input
                    value={employeeName}
                    onChange={e => setEmployeeName(e.target.value)}
                    placeholder="Имя"
                  />
                  <input
                    value={employeeRole}
                    onChange={e => setEmployeeRole(e.target.value)}
                    placeholder="Должность"
                  />
                  <button onClick={handleSaveEmployee}>Сохранить</button>
                  <button onClick={() => setEmployeeForm(false)}>Отмена</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно статистики */}
      {statsModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setStatsModal(false); }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              background: "rgba(255,255,255,0.85)",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              minWidth: 900,
              minHeight: 540,
              padding: 36,
              gap: 36,
              alignItems: "flex-start"
            }}
          >
            {/* Левая часть */}
            <div style={{display: "flex", flexDirection: "column", gap: 32, minWidth: 320}}>
              {/* Проекты */}
              <div style={{
                background: "#f8faff",
                borderRadius: 18,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: 24,
                minWidth: 280,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}>
                <div style={{fontWeight: 600, fontSize: 18, marginBottom: 12}}>Проекты</div>
                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                  <div style={{width: 110, height: 110, position: "relative"}}>
                    <canvas id="projectsChart" width={110} height={110}></canvas>
                    {/* Можно добавить SVG-заглушку, если Chart.js не используется */}
                  </div>
                  <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                      <span style={{
                        display: "inline-block",
                        width: 18,
                        height: 4,
                        borderRadius: 2,
                        background: "#4CAF50"
                      }}></span>
                      <span style={{fontSize: 14, color: "#222"}}>активные проекты</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                      <span style={{
                        display: "inline-block",
                        width: 18,
                        height: 4,
                        borderRadius: 2,
                        background: "#bfaee5"
                      }}></span>
                      <span style={{fontSize: 14, color: "#222"}}>завершенные проекты</span>
                    </div>
                  </div>
                </div>
                <div style={{position: "absolute", top: 32, right: 32, fontSize: 15, color: "#888"}}>25%</div>
              </div>
              {/* Баги */}
              <div style={{
                background: "#f8faff",
                borderRadius: 18,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                padding: 24,
                minWidth: 280,
                minHeight: 120,
                fontSize: 18,
                color: "#888"
              }}>
                Баги
              </div>
            </div>
            {/* Правая часть */}
            <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center"}}>
              <div style={{fontSize: 28, fontWeight: 600, marginBottom: 24, letterSpacing: 1}}>СТАТИСТИКА</div>
              <div style={{display: "flex", gap: 24}}>
                {/* Активные задачи */}
                <div style={{
                  background: "#fff",
                  borderRadius: 18,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  padding: "18px 32px",
                  minWidth: 180,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <div style={{fontWeight: 600, fontSize: 17, marginBottom: 10}}>Активные задачи</div>
                  <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 16, color: "#222"}}>
                    {[
                      "задача 1", "задача 2", "задача 3", "задача 4", "задача 5", "задача 6", "задача 7", "задача 8", "задача 9"
                    ].map((t, i) => (
                      <li key={i} style={{marginBottom: 6}}>{t}</li>
                    ))}
                  </ul>
                </div>
                {/* Завершенные задачи */}
                <div style={{
                  background: "#e5e5e5",
                  borderRadius: 18,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  padding: "18px 32px",
                  minWidth: 180,
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <div style={{fontWeight: 600, fontSize: 17, marginBottom: 10}}>Завершенные задачи</div>
                  <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 16, color: "#222"}}>
                    {[
                      "задача 11", "задача 12", "задача 13", "задача 14", "задача 15", "задача 16"
                    ].map((t, i) => (
                      <li key={i} style={{marginBottom: 6}}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбранного проекта */}
      {selectedProjectIdx !== null && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelectedProjectIdx(null); }}>
          <div
            className="project-board"
            style={{
              background: "#eaeaea",
              borderRadius: 24,
              padding: 32,
              minWidth: 950,
              minHeight: 540,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative"
            }}
          >
            {/* Header */}
            <div style={{display: "flex", alignItems: "center", width: "100%", marginBottom: 18}}>
              <span
                style={{
                  background: "#bfaee5",
                  color: "#222",
                  borderRadius: 18,
                  padding: "8px 28px",
                  fontWeight: 600,
                  fontSize: 22,
                  marginRight: 24
                }}
              >
                {projects[selectedProjectIdx].name}
              </span>
              <button
                className="project-add-task-btn"
                style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  fontSize: 20,
                  cursor: "pointer",
                  marginRight: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
                title="Добавить задачу"
                onClick={() => setTaskEdit({ mode: "add", status: "new", value: "", id: null })}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <input
                type="date"
                value={projects[selectedProjectIdx].date}
                onChange={e => {
                  const arr = [...projects];
                  arr[selectedProjectIdx].date = e.target.value;
                  setProjects(arr);
                }}
                className="project-date-input"
                style={{
                  fontSize: 16,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  padding: "6px 12px",
                  marginRight: 10
                }}
              />
              <button
                className="project-close-btn"
                onClick={() => setSelectedProjectIdx(null)}
                title="Закрыть"
                style={{
                  fontSize: 28,
                  background: "none",
                  border: "none",
                  color: "#555",
                  marginLeft: "auto",
                  cursor: "pointer"
                }}
              >×</button>
            </div>
            {/* Main Board */}
            <div style={{display: "flex", width: "100%", gap: 24, alignItems: "stretch"}}>
              {/* Задачи */}
              <div style={{display: "flex", flex: 3, gap: 18}}>
                {/* Новые задачи */}
                <div style={{
                  background: "#bfe5c6",
                  borderRadius: 18,
                  flex: 1,
                  minWidth: 180,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{fontWeight: 600, fontSize: 18, marginBottom: 10}}>Новые задачи</div>
                  <div style={{flex: 1}}>
                    {projects[selectedProjectIdx].tasks.filter(t => t.status === "new").map(task => (
                      <div key={task.id} style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <input
                              value={taskEdit.value}
                              onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                              style={{flex: 1, marginRight: 8, fontSize: 16}}
                            />
                            <button
                              className="task-move-btn"
                              title="Сохранить"
                              onClick={() => {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                  t.id === task.id ? { ...t, title: taskEdit.value } : t
                                );
                                setProjects(arr);
                                setTaskEdit(null);
                              }}
                            >✔</button>
                            <button
                              className="task-move-btn"
                              title="Отмена"
                              onClick={() => setTaskEdit(null)}
                            >×</button>
                          </>
                        ) : (
                          <>
                            <span>{task.title}</span>
                            <div style={{display: "flex", gap: 6}}>
                              <button
                                className="task-move-btn"
                                title="В работу"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                    t.id === task.id ? { ...t, status: "in_progress" } : t
                                  );
                                  setProjects(arr);
                                }}
                              >→</button>
                              <button
                                className="task-move-btn"
                                title="Редактировать"
                                onClick={() => setTaskEdit({ mode: "edit", status: "new", value: task.title, id: task.id })}
                              ><i className="fa-regular fa-pen-to-square"></i></button>
                              <button
                                className="task-move-btn"
                                title="Удалить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.filter(t => t.id !== task.id);
                                  setProjects(arr);
                                }}
                              >🗑️</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {/* Добавление новой задачи */}
                    {taskEdit && taskEdit.mode === "add" && taskEdit.status === "new" && (
                      <div style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <input
                          value={taskEdit.value}
                          onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                          placeholder="Название задачи"
                          style={{flex: 1, marginRight: 8, fontSize: 16}}
                        />
                        <button
                          className="task-move-btn"
                          title="Добавить"
                          onClick={() => {
                            if (taskEdit.value.trim()) {
                              const arr = [...projects];
                              arr[selectedProjectIdx].tasks.push({
                                id: Date.now(),
                                title: taskEdit.value.trim(),
                                status: "new"
                              });
                              setProjects(arr);
                              setTaskEdit(null);
                            }
                          }}
                        >✔</button>
                        <button
                          className="task-move-btn"
                          title="Отмена"
                          onClick={() => setTaskEdit(null)}
                        >×</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* В работе */}
                <div style={{
                  background: "#bfaee5",
                  borderRadius: 18,
                  flex: 1,
                  minWidth: 180,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{fontWeight: 600, fontSize: 18, marginBottom: 10}}>В работе</div>
                  <div style={{flex: 1}}>
                    {projects[selectedProjectIdx].tasks.filter(t => t.status === "in_progress").map(task => (
                      <div key={task.id} style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <input
                              value={taskEdit.value}
                              onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                              style={{flex: 1, marginRight: 8, fontSize: 16}}
                            />
                            <button
                              className="task-move-btn"
                              title="Сохранить"
                              onClick={() => {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                  t.id === task.id ? { ...t, title: taskEdit.value } : t
                                );
                                setProjects(arr);
                                setTaskEdit(null);
                              }}
                            >✔</button>
                            <button
                              className="task-move-btn"
                              title="Отмена"
                              onClick={() => setTaskEdit(null)}
                            >×</button>
                          </>
                        ) : (
                          <>
                            <span>{task.title}</span>
                            <div style={{display: "flex", gap: 6}}>
                              <button
                                className="task-move-btn"
                                title="Готово"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                    t.id === task.id ? { ...t, status: "done" } : t
                                  );
                                  setProjects(arr);
                                }}
                              >→</button>
                              <button
                                className="task-move-btn"
                                title="Редактировать"
                                onClick={() => setTaskEdit({ mode: "edit", status: "in_progress", value: task.title, id: task.id })}
                              ><i className="fa-regular fa-pen-to-square"></i></button>
                              <button
                                className="task-move-btn"
                                title="Удалить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.filter(t => t.id !== task.id);
                                  setProjects(arr);
                                }}
                              >🗑️</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {/* Добавление новой задачи */}
                    {taskEdit && taskEdit.mode === "add" && taskEdit.status === "in_progress" && (
                      <div style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <input
                          value={taskEdit.value}
                          onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                          placeholder="Название задачи"
                          style={{flex: 1, marginRight: 8, fontSize: 16}}
                        />
                        <button
                          className="task-move-btn"
                          title="Добавить"
                          onClick={() => {
                            if (taskEdit.value.trim()) {
                              const arr = [...projects];
                              arr[selectedProjectIdx].tasks.push({
                                id: Date.now(),
                                title: taskEdit.value.trim(),
                                status: "in_progress"
                              });
                              setProjects(arr);
                              setTaskEdit(null);
                            }
                          }}
                        >✔</button>
                        <button
                          className="task-move-btn"
                          title="Отмена"
                          onClick={() => setTaskEdit(null)}
                        >×</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Готовое */}
                <div style={{
                  background: "#e5bfd2",
                  borderRadius: 18,
                  flex: 1,
                  minWidth: 180,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{fontWeight: 600, fontSize: 18, marginBottom: 10}}>Готовое</div>
                  <div style={{flex: 1}}>
                    {projects[selectedProjectIdx].tasks.filter(t => t.status === "done").map(task => (
                      <div key={task.id} style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <input
                              value={taskEdit.value}
                              onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                              style={{flex: 1, marginRight: 8, fontSize: 16}}
                            />
                            <button
                              className="task-move-btn"
                              title="Сохранить"
                              onClick={() => {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                  t.id === task.id ? { ...t, title: taskEdit.value } : t
                                );
                                setProjects(arr);
                                setTaskEdit(null);
                              }}
                            >✔</button>
                            <button
                              className="task-move-btn"
                              title="Отмена"
                              onClick={() => setTaskEdit(null)}
                            >×</button>
                          </>
                        ) : (
                          <>
                            <span>{task.title}</span>
                            <div style={{display: "flex", gap: 6}}>
                              <button
                                className="task-move-btn"
                                title="Редактировать"
                                onClick={() => setTaskEdit({ mode: "edit", status: "done", value: task.title, id: task.id })}
                              ><i className="fa-regular fa-pen-to-square"></i></button>
                              <button
                                className="task-move-btn"
                                title="Удалить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.filter(t => t.id !== task.id);
                                  setProjects(arr);
                                }}
                              >🗑️</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {/* Добавление новой задачи */}
                    {taskEdit && taskEdit.mode === "add" && taskEdit.status === "done" && (
                      <div style={{
                        background: "#fff",
                        borderRadius: 10,
                        marginBottom: 10,
                        padding: "10px 14px",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <input
                          value={taskEdit.value}
                          onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                          placeholder="Название задачи"
                          style={{flex: 1, marginRight: 8, fontSize: 16}}
                        />
                        <button
                          className="task-move-btn"
                          title="Добавить"
                          onClick={() => {
                            if (taskEdit.value.trim()) {
                              const arr = [...projects];
                              arr[selectedProjectIdx].tasks.push({
                                id: Date.now(),
                                title: taskEdit.value.trim(),
                                status: "done"
                              });
                              setProjects(arr);
                              setTaskEdit(null);
                            }
                          }}
                        >✔</button>
                        <button
                          className="task-move-btn"
                          title="Отмена"
                          onClick={() => setTaskEdit(null)}
                        >×</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Справа: команда и комментарии */}
              <div style={{display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 180}}>
                <div style={{
                  background: "#bfe0e5",
                  borderRadius: 18,
                  padding: 16,
                  minHeight: 110,
                  marginBottom: 8,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{display: "flex", alignItems: "center", marginBottom: 8}}>
                    <span style={{fontWeight: 600, fontSize: 16, flex: 1}}>Команда</span>
                    <button className="team-edit-btn" title="Редактировать" style={{background: "none", border: "none", cursor: "pointer"}}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                  </div>
                  {projects[selectedProjectIdx].team.map((member, idx) => (
                    <div key={idx} className="project-team-member">{member}</div>
                  ))}
                </div>
                <div style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 12,
                  minHeight: 60
                }}>
                  <div style={{fontWeight: 600, fontSize: 15, marginBottom: 6}}>Комментарии</div>
                  <div className="project-comments-list">
                    {projects[selectedProjectIdx].comments.map((c, idx) => (
                      <div key={idx} className="project-comment">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;