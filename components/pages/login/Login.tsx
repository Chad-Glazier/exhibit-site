import styles from "./Login.module.css";
import { api } from "@/util/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingOverlay } from "@/components/general";
import Head from "next/head";

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
      <Head>
        <title>Login &#124; The Museum &amp; Archives of Vernon</title>
      </Head>
      <LoadingOverlay show={loading} />
      <main className={styles.login}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login</h1>
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
          <button className={styles.submit}>Log In</button>
        </form>
      </main>    
    </>
  );
}