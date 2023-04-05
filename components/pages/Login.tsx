import style from "@/styles/LoginPage.module.css";
import { UserData, UserDataSchema, ErrorMessage, ErrorMessageSchema } from "@/types";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const email: string = form.email.value;
    const password: string = form.password.value;

    const response: Response = await fetch(
      "/api/user/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const body: any = await response.json();
    try {
      if (!response.ok) {
        const errorMessage: ErrorMessage = ErrorMessageSchema.parse(body);
        // handle invalid input
        console.log("bad input");
        return;
      }
      const authUser: UserData = UserDataSchema.parse(body);
      router.push("/dashboard");
    } catch {
      console.log("Unexpected parsing error. Server responded with the unparsable object:");
      console.log(body);
    }
  }

  return (
    <div className={style.loginPage}>
      <h1>Administrator Login</h1>
      <form className={style.loginForm} onSubmit={handleSubmit}>
        <label className={style.loginLabel}>
          Username:
          <input type="email" name="email" className={style.loginInput} />
        </label>
        <br />
        <label className={style.loginLabel}>
          Password:
          <input type="password" name="password" className={style.loginInput} />
        </label>
        <br />
        <button type="submit" className={style.loginSubmit}>Login</button>
      </form>
    </div>
  );
}

