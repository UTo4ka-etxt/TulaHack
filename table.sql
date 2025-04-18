-- Удаление таблиц в правильном порядке, чтобы избежать ошибок зависимостей
DROP TABLE IF EXISTS Rollbacks CASCADE;
DROP TABLE IF EXISTS SprintHistory CASCADE;
DROP TABLE IF EXISTS TimeLogs CASCADE;
DROP TABLE IF EXISTS EmployeeTasks CASCADE;
DROP TABLE IF EXISTS EmployeeProjects CASCADE;
DROP TABLE IF EXISTS Bugs CASCADE;
DROP TABLE IF EXISTS TaskWorkflow CASCADE;
DROP TABLE IF EXISTS Tasks CASCADE;
DROP TABLE IF EXISTS Sprints CASCADE;
DROP TABLE IF EXISTS Projects CASCADE;
DROP TABLE IF EXISTS Employees CASCADE;

-- Создание таблицы Сотрудники (Employees)
CREATE TABLE Employees (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    birth_date DATE,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('admin', 'manager', 'developer', 'tester', 'analyst')),
    position VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Создание таблицы Проекты (Projects)
CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    planned_end_date TIMESTAMP,
    actual_end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'on_hold', 'completed', 'cancelled'))
);

-- Создание таблицы Спринты (Sprints)
CREATE TABLE Sprints (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    goal TEXT,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed'))
);

-- Создание таблицы Задачи (Tasks)
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    sprint_id INTEGER REFERENCES Sprints(id) ON DELETE SET NULL,
    project_id INTEGER NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    planned_end_date TIMESTAMP,
    actual_end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'in_review', 'in_testing', 'done', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    story_points INTEGER,
    task_type VARCHAR(20) DEFAULT 'feature' CHECK (task_type IN ('feature', 'bug', 'improvement', 'technical_debt', 'research'))
);

-- Создание таблицы Этапы работы над задачей (TaskWorkflow)
CREATE TABLE TaskWorkflow (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES Tasks(id) ON DELETE CASCADE,
    stage VARCHAR(20) NOT NULL CHECK (stage IN ('analysis', 'development', 'testing', 'review', 'deployment')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP
);

-- Создание таблицы Баги (Bugs)
CREATE TABLE Bugs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES Tasks(id) ON DELETE SET NULL,
    project_id INTEGER NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'reported' CHECK (status IN ('reported', 'confirmed', 'in_progress', 'fixed', 'verified', 'wont_fix')),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    is_regression BOOLEAN DEFAULT FALSE
);

-- Создание таблицы Сотрудники-Проекты (EmployeeProjects)
CREATE TABLE EmployeeProjects (
    employee_id INTEGER NOT NULL REFERENCES Employees(id) ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'developer', 'tester', 'analyst', 'stakeholder')),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, project_id)
);

-- Создание таблицы Сотрудники-Задачи (EmployeeTasks)
CREATE TABLE EmployeeTasks (
    employee_id INTEGER NOT NULL REFERENCES Employees(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES Tasks(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('assignee', 'reviewer', 'tester')),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, task_id, role)
);

-- Создание таблицы Временные затраты (TimeLogs)
CREATE TABLE TimeLogs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES Employees(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES Tasks(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    description TEXT
);

-- Создание таблицы История спринтов (SprintHistory)
CREATE TABLE SprintHistory (
    sprint_id INTEGER NOT NULL REFERENCES Sprints(id) ON DELETE CASCADE,
    total_tasks INTEGER NOT NULL,
    completed_tasks INTEGER NOT NULL,
    planned_story_points INTEGER NOT NULL,
    completed_story_points INTEGER NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы Откаты (Rollbacks)
CREATE TABLE Rollbacks (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES Employees(id) ON DELETE SET NULL,
    project_id INTEGER NOT NULL REFERENCES Projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES Tasks(id) ON DELETE SET NULL,
    rollback_date TIMESTAMP NOT NULL,
    reason TEXT NOT NULL,
    resolution_time_hours INTEGER
);

-- Создание индексов для улучшения производительности
CREATE INDEX idx_tasks_project ON Tasks(project_id);
CREATE INDEX idx_tasks_sprint ON Tasks(sprint_id);
CREATE INDEX idx_tasks_status ON Tasks(status);
CREATE INDEX idx_taskworkflow_task ON TaskWorkflow(task_id);
CREATE INDEX idx_bugs_project ON Bugs(project_id);
CREATE INDEX idx_bugs_task ON Bugs(task_id);
CREATE INDEX idx_employeeprojects_employee ON EmployeeProjects(employee_id);
CREATE INDEX idx_employeeprojects_project ON EmployeeProjects(project_id);
CREATE INDEX idx_employeetasks_employee ON EmployeeTasks(employee_id);
CREATE INDEX idx_employeetasks_task ON EmployeeTasks(task_id);
CREATE INDEX idx_timelogs_task ON TimeLogs(task_id);
CREATE INDEX idx_timelogs_employee ON TimeLogs(employee_id);
CREATE INDEX idx_sprinthistory_sprint ON SprintHistory(sprint_id);
CREATE INDEX idx_rollbacks_project ON Rollbacks(project_id);
CREATE INDEX idx_rollbacks_task ON Rollbacks(task_id);
CREATE INDEX idx_rollbacks_employee ON Rollbacks(employee_id);