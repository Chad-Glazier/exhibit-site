import styles from "./AddAccount.module.css";
import { UserData } from "@/types";
import { LoadingOverlay, Popup } from "@/components/general";
import { useState } from "react";
import { api } from "@/util/client";

export default function AddAccount({
  show,
  close,
  onAdd,
  forceShow,
  allUsers
}: {
  show: boolean;
  close: () => void;
  onAdd: (user: UserData) => void;
  forceShow: () => void;
  allUsers: UserData[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <LoadingOverlay show={loading && !show} />
      <Popup show={show} onClickAway={close}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
    
            const name = (document.getElementById("name") as HTMLInputElement).value;
            const email = (document.getElementById("email") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;
            const passwordConfirm = (document.getElementById("password-confirm") as HTMLInputElement).value;
          
            if (password !== passwordConfirm) {
              setError("Passwords must match");
              return; 
            }

            if (allUsers.find(user => user.email === email) !== undefined) {
              setError("That email is already in use");
              return;
            }

            close();
            setLoading(true);
            const res = await api.user.post({
              name,
              email,
              password,
              isMaster: false
            }, {
              dontLogIn: true
            });
            setLoading(false);
            if (!res.ok) {
              setError(res.error);
              forceShow();
            } else {
              onAdd(res.body);
              setError("");
            }
          }}
        >
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
          />    
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
          />                  
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
          />
          <label htmlFor="password-confirm">Confirm Password</label>
          <input
            id="password-confirm"
            type="password"
            required
          />   
          <em
            className={styles.note}
          >
            {error}
          </em>
          <div
            className={styles.buttons}
          >
            <button>
              Create Account
            </button>            
            <button
              onClick={e => {
                e.preventDefault();
                close();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Popup>    
    </>
  );
}