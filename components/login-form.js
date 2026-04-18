"use client";

import { useState, useTransition } from "react";

export default function LoginForm({ authorizedUsername, onLogin, authError = "", loading = false }) {
  const [username, setUsername] = useState(authorizedUsername);
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    startTransition(async () => {
      const success = await onLogin?.({
        username,
        password,
      });

      if (!success) {
        return;
      }

      setPassword("");
    });
  }

  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Editor Sign-In</p>
          <h2>Step behind the counter</h2>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={authorizedUsername}
            required
          />
          <p className="field-note">Readers do not need an account. Only {authorizedUsername} can publish or edit posts.</p>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter the password"
            required
          />
        </div>

        {feedback || authError ? <p className="feedback error">{feedback || authError}</p> : null}

        <div className="button-row">
          <button className="button" type="submit" disabled={isPending || loading}>
            {isPending || loading ? "Opening desk..." : "Log In"}
          </button>
        </div>
      </form>
    </section>
  );
}
