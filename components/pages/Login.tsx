import styles from "./Login.module.css";
import { user } from "@/util/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard");
  });
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    const response = await user.authenticate(email, password);
    
    if (response.ok) {
      router.push("/dashboard");
      return
    }

    alert("Incorrect email or password");
  }

  return (
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
  )
}