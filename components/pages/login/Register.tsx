import styles from "./Register.module.css";
import { api } from "@/util/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@/components/general";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    router.prefetch("/dashboard");
  });
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    const passwordConfirm = (e.currentTarget.elements.namedItem("password-confirm") as HTMLInputElement).value;
    const masterKey = (e.currentTarget.elements.namedItem("master-key") as HTMLInputElement).value;

    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const response = await api.user.post({
      name,
      email,
      password,
      isMaster: true      
    }, {
      masterKey: masterKey
    });
    
    if (response.ok) {
      router.push("/dashboard");
      return
    }

    setLoading(false);
    alert(response.error);
  }

  return (
    <main className={styles.login}>
      <h1 className={styles.heading}>
        Register
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          className={styles.input}
          type="text" id="name" name="name"
          required={true}
        />
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
        <label className={styles.label} htmlFor="password-confirm">
          Confirm Password
        </label>
        <input 
          className={styles.input} 
          type="password" id="password-confirm" name="password-confirm"
          required={true}
        />
        <label className={styles.label} htmlFor="master-key">
          Master Key
        </label>
        <input 
          className={styles.input} 
          type="password" id="master-key" name="master-key"
          required={true}
        />
        <button>Register</button>
      </form>
    </main>
  )
}