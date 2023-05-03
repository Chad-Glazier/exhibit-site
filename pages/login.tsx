import style from "@/styles/LoginPage.module.css";
import { useRouter } from "next/router";
import postAuthenticate from "@/util/client/ApiClient/user/postAuthenticate";

export default function Login() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const email: string = form.email.value;
    const password: string = form.password.value;

    const res = await postAuthenticate(email, password);
    if (res.ok) {
      router.push("/dashboard");
      return;
    }
    console.log("bad input");
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

