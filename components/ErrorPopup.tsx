import styles from "@/styles/ErrorPopup.module.css";

export interface ErrorPopup {
  message: string;
  onOkay: () => void;
}

export default function ErrorPopup({
    message,
    onOkay
}: ErrorPopup) {
  return (
    <div className={styles.overlay} onClick={onOkay}>
      <div className={styles.popup}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.okButton} onClick={onOkay}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}