import styles from "./Login.module.css";
import { api } from "@/util/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@/components/general";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard");
  });
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    setLoading(true);
    const response = await api.user.authenticate(email, password);

    if (response.ok) {
      router.push("/dashboard");
      return
    }

    setLoading(false);

    alert("Incorrect email or password");
  }

  return (
    <>
      <LoadingOverlay show={loading} />
      <main className={styles.login}>
        <h1 className={styles.heading}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input 
            className={styles.input} 
            type="email" id="email" name="email"
            required={true}
          />
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input 
            className={styles.input} 
            type="password" id="password" name="password"
            required={true}
          />
          <button>Log In</button>
        </form>
      </main>    
    </>

  )
}