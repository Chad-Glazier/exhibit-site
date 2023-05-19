import { LoadingOverlay, Popup } from "@/components/general";
import styles from "./DeleteUser.module.css";
import { UserData } from "@/types";
import { api } from "@/util/client";
import { useState } from "react";

export default function DeleteUser({
  show,
  onClose,
  userData,
  onConfirm
}: {
  show: boolean;
  onClose: () => void;
  userData: UserData;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup
        show={show}
        onClickAway={() => onClose()}
      >
        <div className={styles.popup}>
          <h1 className={styles.popupTitle}>Delete User</h1>
          <p>Are you sure you want to delete user &quot;{userData.name}&quot;&#x3F;</p>
          <div
            className={styles.popupButtons}
          >
            <button 
              className={styles.button}
              onClick={async () => {
                setLoading(true);
                const res = await api.user.deleteOne(userData.email);
                if (!res.ok) {
                  alert(res.error);
                } else {
                  onConfirm();
                }
                setLoading(false);
                onClose();
              }}
            >
              Confirm
            </button>
            <button 
              className={styles.button}
              onClick={() => onClose()}
            >
              Cancel
            </button>    
          </div>
        </div>
      </Popup>    
    </>
  );
}