import styles from "./Alert.module.css";
import { Popup } from "@/components/general";
import { useCallback } from "react";

export default function Alert({
  message,
  setMessage
}: {
  message: string | null;
  setMessage: (message: string | null) => void;
}) {
  const clear = useCallback(() => setMessage(null), [setMessage]);

  return (
    <Popup
      show={message !== null}
      onClickAway={clear}
    >
      <div
        className={styles.container}
      >
        {message}
        <button
          className={styles.button}
          onClick={clear}
        >
          Close
        </button>
      </div>
    </Popup>
  )
}