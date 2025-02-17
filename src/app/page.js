"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/setup");
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <button className={styles.button} onClick={handleLogin}>
            Login With Jira
          </button>
        </div>
      </main>
    </div>
  );
}
