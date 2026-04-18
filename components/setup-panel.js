"use client";

export default function SetupPanel({ missingItems }) {
  return (
    <section className="panel auth-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Firebase Setup</p>
          <h2>Finish the connection</h2>
        </div>
      </div>

      <p className="setup-copy">
        The site is built and ready, but it still needs your Firebase project values before public reviews and editor controls can go live.
      </p>

      <ol className="setup-list">
        <li>Create a Firebase project and enable Email/Password authentication.</li>
        <li>Create a Firestore database for the review collection.</li>
        <li>Copy <span className="code-chip">.env.example</span> to <span className="code-chip">.env.local</span> and fill in the missing values.</li>
        <li>Run <span className="code-chip">npm run seed:user</span> to create the single allowed login user.</li>
      </ol>

      <p className="field-note">
        Missing right now: {missingItems.join(", ")}
      </p>
    </section>
  );
}
