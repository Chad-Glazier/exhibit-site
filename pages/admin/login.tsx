import style from "@/styles/LoginPage.module.css";
import { Credentials, ErrorMessage, ErrorMessageSchema } from "@/types";
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
    
    const credentials: Credentials = {
      password,
      email
    };

    const response: Response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      try {
        const errorMessage: ErrorMessage = ErrorMessageSchema.parse(response.body);
        // handle the invalid credentials
        console.error(errorMessage.message);
      } catch(e: any) {
        // handle the (unexpected) parsing error
        console.error("Error parsing the ErrorMessage from the response.");
      }
      return;
    }

    router.push("/admin/dashboard");
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

