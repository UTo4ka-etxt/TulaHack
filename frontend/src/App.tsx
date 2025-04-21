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

const Logo2na2s = () => (
  <svg width="110" height="110" viewBox="0 0 54 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: "block"}}>
    {/* Верхняя двойка */}
    <text x="27" y="38" textAnchor="middle" fontSize="50" fontWeight="bold" fill="#7FC7A3" fontFamily="Arial, sans-serif">2</text>
    {/* Синие полоски слева и справа */}
    <rect x="4" y="34" width="5" height="28" rx="2" fill="#0050B8"/>
    <rect x="43" y="34" width="5" height="28" rx="2" fill="#0050B8"/>
    {/* na по центру */}
    <text x="27" y="50" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#181C23" fontFamily="Arial, sans-serif" letterSpacing="2" alignmentBaseline="middle" dominantBaseline="middle">na</text>
    {/* Нижняя двойка (перевернутая) */}
    <g transform="rotate(180 27 92)">
      <text x="27" y="122" textAnchor="middle" fontSize="50" fontWeight="bold" fill="#7FC7A3" fontFamily="Arial, sans-serif">2</text>
    </g>
  </svg>
);

const App: React.FC = () => {
  const [projects, setProjects] = useState([
    {
      name: "Проект 1",
      date: "2025-06-15",
      tasks: [
        { id: 1, title: "Задача 1", status: "new", description: "", assignee: "" },
        { id: 2, title: "Задача 2", status: "in_progress", description: "", assignee: "" },
        { id: 3, title: "Задача 3", status: "done", description: "", assignee: "" }
      ],
      team: ["Петров Петр", "Иванов Иван"],
      comments: ["Комментарий 1", "Комментарий 2"]
    },
    {
      name: "Проект 2",
      date: "2025-06-20",
      tasks: [
        { id: 4, title: "Задача 4", status: "new", description: "", assignee: "" }
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
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [projectsModal, setProjectsModal] = useState(false);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [statsModal, setStatsModal] = useState(false);
  const [statsTab, setStatsTab] = useState<"tasks" | "projects" | "time">("tasks");
  const [statsProjectIdx, setStatsProjectIdx] = useState<number>(-1); // -1 = все проекты
  const [employeesModal, setEmployeesModal] = useState(false);
  const [employees, setEmployees] = useState(initialEmployees);
  const [employeeForm, setEmployeeForm] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [editEmployeeIdx, setEditEmployeeIdx] = useState<number | null>(null);
  const [status, setStatus] = useState(true);
  const [taskEdit, setTaskEdit] = useState<null | {mode: "add"|"edit", status: "new"|"in_progress"|"done", value: string, id: number|null, description?: string}>(null);
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState<number | null>(null);
  const [fadingTasks, setFadingTasks] = useState<{[taskId: number]: boolean}>({});

  // Для редактирования команды
  const [editTeam, setEditTeam] = useState(false);

  // Для редактирования комментариев
  const [commentEditIdx, setCommentEditIdx] = useState<number | null>(null);
  const [commentEditValue, setCommentEditValue] = useState("");
  const [newCommentValue, setNewCommentValue] = useState("");

  // --- Удалить useRef и маленький график, оставить только большой график ---
  // --- Chart.js Pie Chart Ref ---
  // const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  // const pieChartInstance = useRef<Chart | null>(null);

  // --- Chart.js Pie Chart Effect для большого графика ---
  const bigPieChartRef = useRef<HTMLCanvasElement | null>(null);
  const bigPieChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (statsModal && bigPieChartRef.current) {
      const pieData = getProjectStatsPieData();
      if (bigPieChartInstance.current) {
        bigPieChartInstance.current.destroy();
      }
      bigPieChartInstance.current = new Chart(bigPieChartRef.current, {
        type: "doughnut",
        data: {
          labels: pieData.labels,
          datasets: [{
            data: pieData.data,
            backgroundColor: pieData.colors,
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
    }
    return () => {
      if (bigPieChartInstance.current) {
        bigPieChartInstance.current.destroy();
        bigPieChartInstance.current = null;
      }
    };
  }, [statsModal, statsProjectIdx, projects]);

  // Chart.js инициализация
  useEffect(() => {
    if (statsModal) {
      setTimeout(() => {
        if (statsTab === "projects") {
          const ctx = document.getElementById("projectsChart") as HTMLCanvasElement;
          if (ctx) {
            // Удаляем предыдущий график, если есть
            if ((window as any).projectsChartInstance) {
              (window as any).projectsChartInstance.destroy();
            }
            const pieData = getProjectStatsPieData();
            (window as any).projectsChartInstance = new Chart(ctx, {
              type: "doughnut",
              data: {
                labels: pieData.labels,
                datasets: [{
                  data: pieData.data,
                  backgroundColor: pieData.colors,
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
    // Чистим график при закрытии окна
    return () => {
      if ((window as any).projectsChartInstance) {
        (window as any).projectsChartInstance.destroy();
        (window as any).projectsChartInstance = null;
      }
    };
  }, [statsModal, statsTab, statsProjectIdx, projects]);

  // Получение данных для круговой диаграммы по проекту или всем проектам
  const getProjectStatsPieData = () => {
    let tasks: any[] = [];
    if (statsProjectIdx === -1) {
      // все проекты
      projects.forEach(p => tasks.push(...p.tasks));
    } else if (projects[statsProjectIdx]) {
      tasks = projects[statsProjectIdx].tasks;
    }
    const newCount = tasks.filter(t => t.status === "new" || t.status === "backlog" || t.status === "todo").length;
    const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
    const doneCount = tasks.filter(t => t.status === "done").length;
    return {
      labels: ["Новые", "В работе", "Завершённые"],
      data: [newCount, inProgressCount, doneCount],
      colors: ["#bfe5c6", "#bfaee5", "#e5bfd2"]
    };
  };

  // --- ДОБАВИТЬ useEffect для круговой диаграммы справа ---
  useEffect(() => {
    if (statsModal) {
      setTimeout(() => {
        const ctx = document.getElementById("allProjectsPie") as HTMLCanvasElement;
        if (ctx) {
          // Удаляем предыдущий график, если есть
          if ((window as any).allProjectsPieInstance) {
            (window as any).allProjectsPieInstance.destroy();
          }
          // Собираем все задачи всех проектов
          let allTasks: any[] = [];
          projects.forEach(p => allTasks.push(...p.tasks));
          const newCount = allTasks.filter(t => t.status === "new" || t.status === "backlog" || t.status === "todo").length;
          const inProgressCount = allTasks.filter(t => t.status === "in_progress").length;
          const doneCount = allTasks.filter(t => t.status === "done").length;
          (window as any).allProjectsPieInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: ["Новые", "В работе", "Завершённые"],
              datasets: [{
                data: [newCount, inProgressCount, doneCount],
                backgroundColor: ["#bfe5c6", "#bfaee5", "#e5bfd2"],
                borderWidth: 0
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: { legend: { display: false } }
            }
          });
          ctx.dataset.rendered = "true";
        }
      }, 100);
    }
    // Чистим график при закрытии окна
    return () => {
      if ((window as any).allProjectsPieInstance) {
        (window as any).allProjectsPieInstance.destroy();
        (window as any).allProjectsPieInstance = null;
      }
    };
  }, [statsModal, projects]);

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

  // Удаление проекта
  const handleDeleteProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
    // Если удаляемый проект был выбран, закрыть подробный просмотр
    if (selectedProjectIdx === idx) setSelectedProjectIdx(null);
    // Если удаляемый проект был активен на главной, сбросить активный
    if (activeProject === idx) setActiveProject(null);
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
    const nameToRemove = employees[idx].name;
    setEmployees(employees.filter((_, i) => i !== idx));
    // Удаляем сотрудника из всех команд проектов
    setProjects(projects =>
      projects.map(project => ({
        ...project,
        team: project.team.filter(member => member !== nameToRemove)
      }))
    );
  };

  // Открытие формы редактирования сотрудника
  const handleEditEmployee = (idx: number) => {
    setEmployeeName(employees[idx].name);
    setEmployeeRole(employees[idx].role);
    setEditEmployeeIdx(idx);
    setEmployeeForm(true);
  };

  // Получить исполнителя задачи (по EmployeeTasks или team, если нет связки)
  const getTaskAssignee = (projectIdx: number, taskId: number) => {
    // В демо-данных нет связки, просто берем первого из team
    const team = projects[projectIdx].team;
    return team && team.length > 0 ? team[0] : "—";
  };

  // Отметить задачу выполненной с анимацией
  const handleCompleteTask = (projectIdx: number, taskId: number) => {
    setFadingTasks(prev => ({ ...prev, [taskId]: true }));
    setTimeout(() => {
      const arr = [...projects];
      arr[projectIdx].tasks = arr[projectIdx].tasks.map(t =>
        t.id === taskId ? { ...t, status: "done" } : t
      );
      setProjects(arr);
      setFadingTasks(prev => {
        const copy = { ...prev };
        delete copy[taskId];
        return copy;
      });
    }, 400); // 400мс для плавности
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
          <header className="header app-header-rounded">
            <div className="logo logo-svg">
              <Logo2na2s />
            </div>
            <div className="header-right">
              <span
                className="status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 20,
                  padding: "5px 15px",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onClick={() => setStatus(s => !s)}
                title="Сменить статус"
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    marginRight: 8,
                    background: status ? "#1976d2" : "#ff9800",
                    boxShadow: status
                      ? "0 0 0 4px rgba(25,118,210,0.15)"
                      : "0 0 0 4px rgba(255,152,0,0.15)",
                    transition: "background 0.2s, box-shadow 0.2s"
                  }}
                />
                {status ? "Работаю" : "Отдыхаю"}
              </span>
              <i className="fa-regular fa-user account-icon" />
              <i className="fa-regular fa-bell notifications" />
            </div>
          </header>

          {/* Заголовок */}
          <h1 className="main-title">ЗАДАЧИ</h1>

          {/* Проекты */}
          <div className="projects-row" style={{display: "flex", flexDirection: "row", gap: 36, marginBottom: 32}}>
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={`project-pill${activeProject === idx ? " active" : ""}`}
                onClick={() => setSelectedProjectIdx(idx)}
                style={{
                  minWidth: 340,
                  maxWidth: 420,
                  minHeight: 80,
                  background: idx === 0 ? "#bfe5c6" : idx === 1 ? "#ffe0a3" : idx === 2 ? "#ffffb5" : "#f3f3f3",
                  color: activeProject === idx ? "#fff" : "#222",
                  boxShadow: activeProject === idx ? "0 4px 18px rgba(0,0,0,0.12)" : "0 2px 8px rgba(0,0,0,0.08)",
                  fontWeight: activeProject === idx ? 600 : 500,
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  transition: "box-shadow 0.2s, background 0.2s"
                }}
              >
                <div style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 22,
                  marginBottom: 12,
                  borderRadius: 18,
                  background: "rgba(0,0,0,0.06)",
                  padding: "8px 0"
                }}>
                  {project.name}
                </div>
                {/* Список активных задач под проектом (всегда отображается) */}
                <div style={{
                  width: "98%",
                  minHeight: 140,
                  background: "transparent",
                  borderRadius: 16,
                  padding: "10px 0 10px 0",
                  fontSize: 17,
                  color: "#222",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  {project.tasks.filter(t => t.status === "in_progress").length > 0 ? (
                    <ul style={{listStyle: "none", padding: 0, margin: 0, width: "100%"}}>
                      {project.tasks.filter(t => t.status === "in_progress").map(t => (
                        <li
                          key={t.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                            background: "#f6fcff",
                            borderRadius: 12,
                            padding: "12px 18px",
                            width: "100%",
                            fontSize: 17
                          }}
                        >
                          <span style={{fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{t.title}</span>
                          <span style={{marginLeft: 18, color: "#888", fontSize: 15, flexShrink: 0}}>
                            {t.assignee || "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{color: "#bbb", fontSize: 16, width: "100%", textAlign: "center"}}>Нет задач в работе</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Удалить старый блок tasks-columns-row */}
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
                  style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8}}
                >
                  <span
                    style={{flex: 1, cursor: "pointer"}}
                    onClick={() => {
                      setSelectedProjectIdx(idx);
                      setProjectsModal(false);
                    }}
                  >
                    {project.name}
                  </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c00",
                      fontSize: 18,
                      cursor: "pointer",
                      marginLeft: 8
                    }}
                    title="Удалить проект"
                    onClick={() => handleDeleteProject(idx)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
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
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start"
              }}>
                <div style={{fontWeight: 600, fontSize: 18, marginBottom: 12}}>Проекты</div>
                {/* Выбор проекта */}
                <select
                  value={statsProjectIdx}
                  onChange={e => setStatsProjectIdx(Number(e.target.value))}
                  style={{
                    marginBottom: 18,
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 16,
                    border: "1px solid #ccc",
                    background: "#fff",
                    minWidth: 180
                  }}
                >
                  <option value={-1}>Все проекты</option>
                  {projects.map((p, idx) => (
                    <option value={idx} key={idx}>{p.name}</option>
                  ))}
                </select>
                {/* Удалить маленький график */}
                {/* <div style={{width: 110, height: 110, position: "relative", margin: "0 auto"}}>
                  <canvas ref={pieChartRef} width={110} height={110} />
                </div> */}
                <div style={{display: "flex", flexDirection: "column", gap: 10, marginTop: 18}}>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <span style={{
                      display: "inline-block",
                      width: 18,
                      height: 4,
                      borderRadius: 2,
                      background: "#bfe5c6"
                    }}></span>
                    <span style={{fontSize: 14, color: "#222"}}>новые задачи</span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <span style={{
                      display: "inline-block",
                      width: 18,
                      height: 4,
                      borderRadius: 2,
                      background: "#bfaee5"
                    }}></span>
                    <span style={{fontSize: 14, color: "#222"}}>в работе</span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <span style={{
                      display: "inline-block",
                      width: 18,
                      height: 4,
                      borderRadius: 2,
                      background: "#e5bfd2"
                    }}></span>
                    <span style={{fontSize: 14, color: "#222"}}>завершённые</span>
                  </div>
                </div>
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
            <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
              <div style={{fontSize: 28, fontWeight: 600, marginBottom: 24, letterSpacing: 1}}>СТАТИСТИКА</div>
              {/* Большая круговая диаграмма, которая меняется при выборе проекта */}
              <div style={{
                width: 320,
                height: 320,
                background: "#fff",
                borderRadius: 24,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24
              }}>
                <div style={{fontWeight: 600, fontSize: 20, marginBottom: 12}}>Соотношение задач</div>
                <canvas
                  ref={bigPieChartRef}
                  width={220}
                  height={220}
                  style={{marginBottom: 16}}
                />
                <div style={{display: "flex", gap: 18, marginTop: 8}}>
                  <div style={{display: "flex", alignItems: "center", gap: 6}}>
                    <span style={{width: 16, height: 4, background: "#bfe5c6", borderRadius: 2, display: "inline-block"}}></span>
                    <span style={{fontSize: 14, color: "#222"}}>новые</span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 6}}>
                    <span style={{width: 16, height: 4, background: "#bfaee5", borderRadius: 2, display: "inline-block"}}></span>
                    <span style={{fontSize: 14, color: "#222"}}>в работе</span>
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 6}}>
                    <span style={{width: 16, height: 4, background: "#e5bfd2", borderRadius: 2, display: "inline-block"}}></span>
                    <span style={{fontSize: 14, color: "#222"}}>завершённые</span>
                  </div>
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
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: 24,
                alignItems: "stretch",
                flexWrap: "wrap"
              }}
            >
              {/* Задачи */}
              <div
                style={{
                  display: "flex",
                  flex: 3,
                  gap: 18,
                  width: "100%",
                  minWidth: 0
                }}
              >
                {/* Новые задачи */}
                <div
                  style={{
                    background: "#bfe5c6",
                    borderRadius: 18,
                    flex: 1,
                    minWidth: 180,
                    maxWidth: taskEdit && taskEdit.mode && taskEdit.status === "new" && taskEdit.id === null ? 420 : 340,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    transition: "max-width 0.3s, min-width 0.3s",
                    maxHeight: 400,
                    overflowY: "auto"
                  }}
                >
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
                        justifyContent: "space-between",
                        minWidth: 0
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <div style={{flex: 1, marginRight: 8}}>
                              <input
                                value={taskEdit.value}
                                onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                                style={{width: "100%", fontSize: 16, marginBottom: 6}}
                                placeholder="Название задачи"
                              />
                              <textarea
                                value={taskEdit.description ?? ""}
                                onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                                style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                                placeholder="Описание задачи"
                              />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                              <button
                                className="task-move-btn"
                                title="Сохранить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                    t.id === task.id
                                      ? { ...t, title: taskEdit.value, description: taskEdit.description ?? "" }
                                      : t
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
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{flex: 1}}>
                              <span>{task.title}</span>
                              {task.description && (
                                <div style={{fontSize: 13, color: "#666", marginTop: 2, whiteSpace: "pre-line"}}>{task.description}</div>
                              )}
                              {/* Выпадающий список для назначения сотрудника */}
                              <div style={{marginTop: 6}}>
                                <select
                                  value={task.assignee || ""}
                                  onChange={e => {
                                    const arr = [...projects];
                                    arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                      t.id === task.id ? { ...t, assignee: e.target.value } : t
                                    );
                                    setProjects(arr);
                                  }}
                                  style={{
                                    fontSize: 14,
                                    borderRadius: 6,
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    marginTop: 2,
                                    width: "100%", // растянуть на всю ширину карточки задачи
                                    boxSizing: "border-box"
                                  }}
                                >
                                  <option value="">— Назначить исполнителя —</option>
                                  {projects[selectedProjectIdx].team.map((member, idx) => (
                                    <option key={idx} value={member}>{member}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
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
                                onClick={() => setTaskEdit({
                                  mode: "edit",
                                  status: "new",
                                  value: task.title,
                                  id: task.id,
                                  description: task.description ?? ""
                                })}
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
                        alignItems: "center",
                        minWidth: 0
                      }}>
                        <div style={{flex: 1, marginRight: 8}}>
                          <input
                            value={taskEdit.value}
                            onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                            placeholder="Название задачи"
                            style={{width: "100%", fontSize: 16, marginBottom: 6}}
                          />
                          <textarea
                            value={taskEdit.description ?? ""}
                            onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                            placeholder="Описание задачи"
                            style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                          />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                          <button
                            className="task-move-btn"
                            title="Добавить"
                            onClick={() => {
                              if (taskEdit.value.trim()) {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks.push({
                                  id: Date.now(),
                                  title: taskEdit.value.trim(),
                                  description: taskEdit.description ?? "",
                                  status: "new",
                                  assignee: ""
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
                      </div>
                    )}
                  </div>
                </div>
                {/* В работе */}
                <div
                  style={{
                    background: "#bfaee5",
                    borderRadius: 18,
                    flex: 1,
                    minWidth: 180,
                    maxWidth: taskEdit && taskEdit.mode && taskEdit.status === "in_progress" && taskEdit.id === null ? 420 : 340,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    transition: "max-width 0.3s, min-width 0.3s",
                    maxHeight: 400,
                    overflowY: "auto"
                  }}
                >
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
                        justifyContent: "space-between",
                        minWidth: 0
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <div style={{flex: 1, marginRight: 8}}>
                              <input
                                value={taskEdit.value}
                                onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                                style={{width: "100%", fontSize: 16, marginBottom: 6}}
                                placeholder="Название задачи"
                              />
                              <textarea
                                value={taskEdit.description ?? ""}
                                onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                                style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                                placeholder="Описание задачи"
                              />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                              <button
                                className="task-move-btn"
                                title="Сохранить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                    t.id === task.id
                                      ? { ...t, title: taskEdit.value, description: taskEdit.description ?? "" }
                                      : t
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
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{flex: 1}}>
                              <span>{task.title}</span>
                              {task.description && (
                                <div style={{fontSize: 13, color: "#666", marginTop: 2, whiteSpace: "pre-line"}}>{task.description}</div>
                              )}
                              {/* Выпадающий список для назначения сотрудника */}
                              <div style={{marginTop: 6}}>
                                <select
                                  value={task.assignee || ""}
                                  onChange={e => {
                                    const arr = [...projects];
                                    arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                      t.id === task.id ? { ...t, assignee: e.target.value } : t
                                    );
                                    setProjects(arr);
                                  }}
                                  style={{
                                    fontSize: 14,
                                    borderRadius: 6,
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    marginTop: 2,
                                    width: "100%", // растянуть на всю ширину карточки задачи
                                    boxSizing: "border-box"
                                  }}
                                >
                                  <option value="">— Назначить исполнителя —</option>
                                  {projects[selectedProjectIdx].team.map((member, idx) => (
                                    <option key={idx} value={member}>{member}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
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
                                onClick={() => setTaskEdit({
                                  mode: "edit",
                                  status: "in_progress",
                                  value: task.title,
                                  id: task.id,
                                  description: task.description ?? ""
                                })}
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
                        alignItems: "center",
                        minWidth: 0
                      }}>
                        <div style={{flex: 1, marginRight: 8}}>
                          <input
                            value={taskEdit.value}
                            onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                            placeholder="Название задачи"
                            style={{width: "100%", fontSize: 16, marginBottom: 6}}
                          />
                          <textarea
                            value={taskEdit.description ?? ""}
                            onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                            placeholder="Описание задачи"
                            style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                          />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                          <button
                            className="task-move-btn"
                            title="Добавить"
                            onClick={() => {
                              if (taskEdit.value.trim()) {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks.push({
                                  id: Date.now(),
                                  title: taskEdit.value.trim(),
                                  description: taskEdit.description ?? "",
                                  status: "in_progress",
                                  assignee: ""
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
                      </div>
                    )}
                  </div>
                </div>
                {/* Готовое */}
                <div
                  style={{
                    background: "#e5bfd2",
                    borderRadius: 18,
                    flex: 1,
                    minWidth: 180,
                    maxWidth: taskEdit && taskEdit.mode && taskEdit.status === "done" && taskEdit.id === null ? 420 : 340,
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    transition: "max-width 0.3s, min-width 0.3s",
                    maxHeight: 400,
                    overflowY: "auto"
                  }}
                >
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
                        justifyContent: "space-between",
                        minWidth: 0
                      }}>
                        {taskEdit && taskEdit.mode === "edit" && taskEdit.id === task.id ? (
                          <>
                            <div style={{flex: 1, marginRight: 8}}>
                              <input
                                value={taskEdit.value}
                                onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                                style={{width: "100%", fontSize: 16, marginBottom: 6}}
                                placeholder="Название задачи"
                              />
                              <textarea
                                value={taskEdit.description ?? ""}
                                onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                                style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                                placeholder="Описание задачи"
                              />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                              <button
                                className="task-move-btn"
                                title="Сохранить"
                                onClick={() => {
                                  const arr = [...projects];
                                  arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                    t.id === task.id
                                      ? { ...t, title: taskEdit.value, description: taskEdit.description ?? "" }
                                      : t
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
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{flex: 1}}>
                              <span>{task.title}</span>
                              {task.description && (
                                <div style={{fontSize: 13, color: "#666", marginTop: 2, whiteSpace: "pre-line"}}>{task.description}</div>
                              )}
                              {/* Выпадающий список для назначения сотрудника */}
                              <div style={{marginTop: 6}}>
                                <select
                                  value={task.assignee || ""}
                                  onChange={e => {
                                    const arr = [...projects];
                                    arr[selectedProjectIdx].tasks = arr[selectedProjectIdx].tasks.map(t =>
                                      t.id === task.id ? { ...t, assignee: e.target.value } : t
                                    );
                                    setProjects(arr);
                                  }}
                                  style={{
                                    fontSize: 14,
                                    borderRadius: 6,
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    marginTop: 2,
                                    width: "100%", // растянуть на всю ширину карточки задачи
                                    boxSizing: "border-box"
                                  }}
                                >
                                  <option value="">— Назначить исполнителя —</option>
                                  {projects[selectedProjectIdx].team.map((member, idx) => (
                                    <option key={idx} value={member}>{member}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                              <button
                                className="task-move-btn"
                                title="Редактировать"
                                onClick={() => setTaskEdit({
                                  mode: "edit",
                                  status: "done",
                                  value: task.title,
                                  id: task.id,
                                  description: task.description ?? ""
                                })}
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
                        alignItems: "center",
                        minWidth: 0
                      }}>
                        <div style={{flex: 1, marginRight: 8}}>
                          <input
                            value={taskEdit.value}
                            onChange={e => setTaskEdit({ ...taskEdit, value: e.target.value })}
                            placeholder="Название задачи"
                            style={{width: "100%", fontSize: 16, marginBottom: 6}}
                          />
                          <textarea
                            value={taskEdit.description ?? ""}
                            onChange={e => setTaskEdit({ ...taskEdit, description: e.target.value })}
                            placeholder="Описание задачи"
                            style={{width: "100%", fontSize: 15, borderRadius: 6, padding: 6, minHeight: 38}}
                          />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                          <button
                            className="task-move-btn"
                            title="Добавить"
                            onClick={() => {
                              if (taskEdit.value.trim()) {
                                const arr = [...projects];
                                arr[selectedProjectIdx].tasks.push({
                                  id: Date.now(),
                                  title: taskEdit.value.trim(),
                                  description: taskEdit.description ?? "",
                                  status: "done",
                                  assignee: ""
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
                  flexDirection: "column",
                  maxHeight: 200,
                  overflowY: "auto"
                }}>
                  <div style={{display: "flex", alignItems: "center", marginBottom: 8}}>
                    <span style={{fontWeight: 600, fontSize: 16, flex: 1}}>Команда</span>
                    <button
                      className="team-edit-btn"
                      title={editTeam ? "Сохранить" : "Редактировать"}
                      style={{background: "none", border: "none", cursor: "pointer"}}
                      onClick={() => {
                        if (editTeam) setEditTeam(false);
                        else setEditTeam(true);
                      }}
                    >
                      <i className={`fa-regular ${editTeam ? "fa-floppy-disk" : "fa-pen-to-square"}`}></i>
                    </button>
                  </div>
                  {editTeam ? (
                    <>
                      {employees.map((emp, idx) => {
                        const isInTeam = projects[selectedProjectIdx].team.includes(emp.name);
                        return (
                          <div key={idx} style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 4}}>
                            <input
                              type="checkbox"
                              checked={isInTeam}
                              onChange={e => {
                                const arr = [...projects];
                                if (e.target.checked) {
                                  arr[selectedProjectIdx].team = [...arr[selectedProjectIdx].team, emp.name];
                                } else {
                                  arr[selectedProjectIdx].team = arr[selectedProjectIdx].team.filter(n => n !== emp.name);
                                }
                                setProjects(arr);
                              }}
                            />
                            <span>{emp.name}</span>
                            <span style={{color: "#888", fontSize: 13}}>({emp.role})</span>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    projects[selectedProjectIdx].team.map((member, idx) => (
                      <div key={idx} className="project-team-member">{member}</div>
                    ))
                  )}
                </div>
                <div style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 12,
                  minHeight: 60,
                  maxHeight: 200,
                  overflowY: "auto"
                }}>
                  <div style={{fontWeight: 600, fontSize: 15, marginBottom: 6}}>Комментарии</div>
                  <div className="project-comments-list">
                    {projects[selectedProjectIdx].comments.map((c, idx) => (
                      <div key={idx} className="project-comment" style={{display: "flex", alignItems: "center", gap: 6, marginBottom: 4}}>
                        {commentEditIdx === idx ? (
                          <>
                            <input
                              value={commentEditValue}
                              onChange={e => setCommentEditValue(e.target.value)}
                              style={{flex: 1, fontSize: 15, marginRight: 6}}
                            />
                            <button
                              style={{border: "none", background: "none", color: "#4CAF50", fontSize: 18, cursor: "pointer"}}
                              title="Сохранить"
                              onClick={() => {
                                const arr = [...projects];
                                arr[selectedProjectIdx].comments[idx] = commentEditValue;
                                setProjects(arr);
                                setCommentEditIdx(null);
                                setCommentEditValue("");
                              }}
                            >✔</button>
                            <button
                              style={{border: "none", background: "none", color: "#c00", fontSize: 18, cursor: "pointer"}}
                              title="Отмена"
                              onClick={() => setCommentEditIdx(null)}
                            >×</button>
                          </>
                        ) : (
                          <>
                            <span style={{flex: 1}}>{c}</span>
                            <button
                              style={{border: "none", background: "none", color: "#888", fontSize: 16, cursor: "pointer"}}
                              title="Редактировать"
                              onClick={() => {
                                setCommentEditIdx(idx);
                                setCommentEditValue(c);
                              }}
                            ><i className="fa-regular fa-pen-to-square"></i></button>
                            <button
                              style={{border: "none", background: "none", color: "#c00", fontSize: 16, cursor: "pointer"}}
                              title="Удалить"
                              onClick={() => {
                                const arr = [...projects];
                                arr[selectedProjectIdx].comments.splice(idx, 1);
                                setProjects(arr);
                              }}
                            >🗑️</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Добавление нового комментария */}
                  <div style={{display: "flex", alignItems: "center", gap: 6, marginTop: 8}}>
                    <input
                      value={newCommentValue}
                      onChange={e => setNewCommentValue(e.target.value)}
                      placeholder="Добавить комментарий"
                      style={{flex: 1, fontSize: 15}}
                    />
                    <button
                      style={{border: "none", background: "none", color: "#4CAF50", fontSize: 18, cursor: "pointer"}}
                      title="Добавить"
                      onClick={() => {
                        if (newCommentValue.trim()) {
                          const arr = [...projects];
                          arr[selectedProjectIdx].comments.push(newCommentValue.trim());
                          setProjects(arr);
                          setNewCommentValue("");
                        }
                      }}
                    >+</button>
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