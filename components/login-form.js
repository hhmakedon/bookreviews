"use client";

import { useState } from "react";

export default function LoginForm({ authorizedUsername, onLogin, authError = "", loading = false }) {
  const [username, setUsername] = useState(authorizedUsername);
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsPending(true);

    try {
      const success = await onLogin?.({
        username,
        password,
      });

      if (!success) {
        return;
      }

      setPassword("");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Editor Sign-In</p>
          <h2>Editor login</h2>
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

        {authError ? <p className="feedback error">{authError}</p> : null}

        <div className="button-row">
          <button className="button" type="submit" disabled={isPending || loading}>
            {isPending || loading ? "Opening desk..." : "Log In"}
          </button>
        </div>
      </form>
    </section>
  );
}
