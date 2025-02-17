"use client";
import { useState, useEffect } from "react";
import styles from "../page.module.css";

export default function SetupPage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [projects, setProjects] = useState([]);
  const [authorized, setAuthorized] = useState(false);

  const handleAuthorize = () => {
    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=read%3Ajira-work%20write%3Ajira-work%20read%3Ajira-user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth-redirect&state=${clientId},${clientSecret}&response_type=code&prompt=consent`;
    window.open(authUrl, "_blank");
  };

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data === "authorized") {
        setAuthorized(true);
        fetch("/api/jira/projects")
          .then((res) => res.json())
          .then((data) => setProjects(data));
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          disabled={authorized}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          disabled={authorized}
        />
        <button
          className={styles.button}
          onClick={handleAuthorize}
          disabled={!clientId || !clientSecret}
        >
          {authorized ? "Reset Authorization" : "Authorize"}
        </button>
      </div>
      {authorized && (
        <div className={styles.successContainer}>
          <p className={styles.successMessage}>Authorized successfully!</p>
          <select className={styles.select}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
