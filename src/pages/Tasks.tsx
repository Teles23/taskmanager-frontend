import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

const TASK_STATUSES = ["EM_ANDAMENTO", "CONCLUIDO", "PENDENTE"]; // Status da tarefa

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("EM_ANDAMENTO");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
        const response = await getTasks(auth.userId!);
        setTasks(response.data);
      } catch (err) {
        setError("Erro ao carregar tarefas. " + err);
      }
    };

    fetchTasks();
  }, [auth, navigate]);

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth?.token || !auth?.userId) return;

    try {
      if (editingTask) {
        // Atualizar tarefa existente
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
        setEditingTask(null);
      } else {
        // Criar nova tarefa
        const response = await createTask(auth.userId, {
          title,
          description,
          status,
          dueDate,
        });
        setTasks([...tasks, response.data]);
      }

      setTitle("");
      setDescription("");
      setStatus("EM_ANDAMENTO");
      setDueDate("");
    } catch (err) {
      setError("Erro ao salvar tarefa." + err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!auth?.token) return;

    try {
      await deleteTask(auth.userId!, taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError("Erro ao excluir tarefa." + err);
    }
  };

  return (
    <div className="tasks-container">
      <h2>Minhas Tarefas</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Título da tarefa"
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

        {/* Dropdown para selecionar o status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Campo para selecionar a data de vencimento */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <button type="submit">{editingTask ? "Atualizar" : "Adicionar"}</button>
        {editingTask && (
          <button onClick={() => setEditingTask(null)}>Cancelar</button>
        )}
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>: {task.description} | {task.status} |{" "}
            {task.dueDate}
            <button onClick={() => handleEditTask(task)}>✏️</button>
            <button onClick={() => handleDeleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <button onClick={auth?.logout}>Sair</button>
    </div>
  );
}

export default Tasks;
