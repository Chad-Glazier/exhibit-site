import { LoadingOverlay, Popup } from "@/components/general";
import styles from "./PasswordReset.module.css";
import { useState } from "react";
import { api } from "@/util/client";

export default function PasswordReset({
  show,
  email,
  close,
  forceShow
}: {
  show: boolean;
  email: string;
  close: () => void;
  forceShow: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      <LoadingOverlay show={loading && !show} />
      <Popup show={show} onClickAway={close}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();

            const password = (document.getElementById("password") as HTMLInputElement).value;
            const passwordConfirm = (document.getElementById("password-confirm") as HTMLInputElement).value;

            if (password !== passwordConfirm) {
              setErrorMessage("Passwords must match");
              return;
            }

            if (password.length <= 0) {
              setErrorMessage("Password must not be empty");
              return;
            }

            close();
            setLoading(true);
            const res = await api.user.updateOne(email, { 
              password 
            });
            setLoading(false);
            if (res.error) {
              setErrorMessage(res.error);
              forceShow();
            } else {
              setErrorMessage("");
            }
          }}
        >
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
          />
          <label htmlFor="password-confirm">Confirm Password</label>
          <input
            id="password-confirm"
            type="password"
          />
          <em className={styles.note}>{errorMessage}</em>
          <div
            className={styles.buttons}
          > 
            <button>
              Reset Password
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
  )
}