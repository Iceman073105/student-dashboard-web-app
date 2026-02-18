import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    const res = login(email, password);
    if (!res.ok) {
      setError(res.message);
      return;
    }

    nav("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 360 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 10 }}>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}