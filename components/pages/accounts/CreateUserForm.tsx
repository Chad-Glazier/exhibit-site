import styles from "./CreateUserForm.module.css";
import { UserData } from "@/types";
import { User } from "@prisma/client";

export default function CreateUserForm({
  existingUsers,
  onUserCreate
}: {
  existingUsers: UserData[];
  onUserCreate: (user: User) => void;
}) {
  return (
    <form 
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault();

        const name = (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
        const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
        const passwordConfirm = (e.currentTarget.elements.namedItem("password-confirm") as HTMLInputElement).value;

        if (password !== passwordConfirm) {
          alert("Passwords do not match");
          return;
        }

        if (existingUsers.map(u => u.email).includes(email)) {
          alert("That email is already taken.");
          return;
        }

        onUserCreate({
          name,
          email,
          password,
          isMaster: false
        });
      }}
    >
      <h1 className={styles.title}>Create User</h1>
      <label className={styles.label} htmlFor="name">
        Name
      </label>
      <input className={styles.input} type="text" id="name" name="name" required />
      <label className={styles.label} htmlFor="email">
        Email
      </label>
      <input className={styles.input} type="email" id="email" name="email" required />
      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input className={styles.input} type="password" id="password" name="password" required />
      <label className={styles.label} htmlFor="password-confirm">
        Confirm Password
      </label>
      <input className={styles.input} type="password" id="password-confirm" name="password-confirm" required />
      <button className={styles.submit}>
        Submit
      </button>
    </form>
  );
}
