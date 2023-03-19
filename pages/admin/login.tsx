import style from "@/styles/LoginPage.module.css";
import { ErrorMessage, ErrorMessageSchema } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/admin/dashboard");
  }, []);

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    
  }

  return (
    <div className={style.loginPage}>
      <h1>Administrator Login</h1>
      <form className={style.loginForm} onSubmit={handleSubmit}>
        <label className={style.loginLabel}>
          Username:
          <input type="email" className={style.loginInput} value={email} onChange={handleUsernameChange} />
        </label>
        <br />
        <label className={style.loginLabel}>
          Password:
          <input type="password" className={style.loginInput} value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit" className={style.loginSubmit}>Login</button>
      </form>
    </div>
  );
}

