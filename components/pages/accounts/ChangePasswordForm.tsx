import styles from "./ChangePasswordForm.module.css";
import { useState } from "react";
import { Popup } from "@/components/general";
import { LoadingOverlay } from "@/components/general";
import { UserData } from "@/types";
import { api } from "@/util/client";

export default function ChangePasswordForm({
  show,
  userData,
  onClose
}: {
  show?: boolean;
  onClose: () => void;
  userData: UserData;
}) {
  const [loading, setLoading] = useState(false);

  if (!show) return <></>;
  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={show && !loading} onClickAway={onClose}>
        <form 
          className={styles.popupForm}
          onSubmit={async (e) => {
            e.preventDefault();

            const newPassword = (e.currentTarget.elements.namedItem("new-password") as HTMLInputElement).value;
            const newPasswordConfirm = (e.currentTarget.elements.namedItem("new-password-confirm") as HTMLInputElement).value;

            if (newPassword !== newPasswordConfirm) {
              alert("Passwords do not match");
              return;
            }

            setLoading(true);
            const res = await api.user.updateOne(userData.email, {
              password: newPassword,
            });

            if (!res.ok) {
              alert(res.error);
            }

            setLoading(false);
            onClose();
          }}
        >
          <h1 className={styles.popupTitle}>Change Password</h1>
          <label className={styles.popupLabel} htmlFor="new-password">New Password</label>
          <input className={styles.popupInput} type="password" id="new-password" name="new-password" required />
          <label className={styles.popupLabel} htmlFor="new-password-confirm">Confirm New Password</label>
          <input className={styles.popupInput} type="password" id="new-password-confirm" name="new-password-confirm" required />
          <button className={styles.popupSubmit} >
            Submit
          </button>
        </form>
      </Popup>
    </>
  )
}