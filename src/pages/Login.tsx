import { useState, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Auth.css"; // ✅ Importamos o CSS unificado para login e cadastro
import loginIllustration from "../assets/react.svg"; // ✅ Ilustração para a tela de login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    return <p>Erro: AuthContext não carregado</p>;
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post(
        "http://localhost:8080/api/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      auth.login(token);
      navigate("/tasks");
    } catch (err) {
      setError("Usuário ou senha incorretos." + err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <img src={loginIllustration} alt="Login Ilustração" />
        </div>
        <div className="auth-right">
          <h2>Task Manager</h2>
          <p className="subtitle">
            Gerencie suas tarefas de forma simples e eficiente
          </p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Entrar</button>
          </form>
          <p className="redirect">
            Não tem uma conta? <a href="/register">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
