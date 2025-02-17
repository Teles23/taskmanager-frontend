import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../services/taskService";
import { getUserById } from "../../services/userService";
import "./Tasks.css";

Modal.setAppElement("#root");

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

const TASK_STATUSES = ["TODAS", "PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"];
const STATUS_LABELS: Record<
  "TODAS" | "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO",
  string
> = {
  TODAS: "Todas as Tarefas",
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
};

const SORT_OPTIONS = [
  { label: "Título", value: "title" },
  { label: "Data de Vencimento", value: "dueDate" },
];

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [dueDate, setDueDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODAS");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token || !auth?.userId) {
      navigate("/");
      return;
    }
    const fetchTasks = async () => {
      try {
        const response = await getTasks(
          auth.userId!,
          filterStatus === "TODAS" ? undefined : filterStatus,
          sortBy,
          sortOrder
        );
        setTasks(response.data);
      } catch (err) {
        setError("Erro ao carregar tarefas.");
      }
    };
    const fetchUserName = async () => {
      try {
        const response = await getUserById(auth.userId!);
        setUserName(response.data.name); // ✅ Armazena o nome do usuário no estado
      } catch (err) {
        console.error("Erro ao buscar nome do usuário.");
      }
    };
    fetchTasks();
    fetchUserName();
  }, [auth, navigate, filterStatus, sortBy, sortOrder]);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDueDate(task.dueDate);
    } else {
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setStatus("PENDENTE");
      setDueDate("");
    }
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSaveTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth?.token || !auth?.userId) return;

    try {
      if (editingTask) {
        await updateTask(auth.userId, editingTask.id, {
          title,
          description,
          status,
          dueDate,
        });
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id
              ? { ...task, title, description, status, dueDate }
              : task
          )
        );
      } else {
        const response = await createTask(auth.userId, {
          title,
          description,
          status,
          dueDate,
        });
        setTasks([...tasks, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      setError("Erro ao salvar tarefa.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!auth?.token) return;

    try {
      await deleteTask(auth.userId!, taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Erro ao excluir tarefa.");
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="tasks-container">
      {/* Barra de Navegação */}
      <nav className="navbar">
        <h2>Task Manager</h2>
        <div className="navbar-actions">
          <span>{auth?.userId ? `Olá ${userName}` : "Usuário"}</span>
          <button className="add-task-btn" onClick={() => handleOpenModal()}>
            + Nova Tarefa
          </button>
          <button className="logout-btn" onClick={auth?.logout}>
            Sair
          </button>
        </div>
      </nav>

      {/* Filtros e Ordenação */}
      <div className="container">
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as
                  | "TODAS"
                  | "PENDENTE"
                  | "EM_ANDAMENTO"
                  | "CONCLUIDO"
              )
            }
          >
            {Object.keys(STATUS_LABELS).map((key) => (
              <option key={key} value={key}>
                {STATUS_LABELS[key as keyof typeof STATUS_LABELS]}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        {/* Cards de Tarefas */}
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className={"status-badge "}>
                {STATUS_LABELS[task.status as keyof typeof STATUS_LABELS]}
              </span>

              <span className="task-date">📅 {formatDate(task.dueDate)}</span>
              <div className="task-actions">
                <button onClick={() => handleOpenModal(task)}>✏️ Editar</button>
                <button onClick={() => handleDeleteTask(task.id)}>
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal para Criar/Editar Tarefa */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>{editingTask ? "Editar Tarefa" : "Criar Nova Tarefa"}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSaveTask}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as keyof typeof STATUS_LABELS)
            }
            required
          >
            {TASK_STATUSES.slice(1).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit">
              {editingTask ? "Atualizar" : "Adicionar"}
            </button>
            <button onClick={handleCloseModal}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Tasks;
