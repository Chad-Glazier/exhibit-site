import styles from "./DeleteAccount.module.css";
import { Popup, LoadingOverlay, Alert } from "@/components/general";
import { useState } from "react";
import { UserData } from "@/types";
import { api } from "@/util/client";

export default function DeleteAccount({
  userData,
  close,
  show,
  onDelete
}: {
  userData: UserData | null;
  close: () => void;
  show: boolean;
  onDelete: (email: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  return (
    <>
      <Alert message={alertMessage} setMessage={setAlertMessage} />
      <LoadingOverlay show={loading && !show} />
      <Popup show={show && userData !== null} onClickAway={close}>
        <form
          className={styles.form}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!userData) return;
            close();
            setLoading(true);
            const res = await api.user.deleteOne(userData.email);
            setLoading(false);
            if (res.error) {
              setAlertMessage(res.error);
            } else {
              onDelete(userData.email);
            }
          }}
        >
          <h1 className={styles.title}>Delete User</h1>
          <p>
            Are you sure you want to delete {userData?.name.endsWith("s") ? `${userData?.name}'` : `${userData?.name}'s`} account?
          </p>
          <div className={styles.buttons}>
            <button
              className={styles.button}
            >
              Delete
            </button>
            <button
              className={styles.button}
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