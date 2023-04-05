import styles from "@/styles/ConfirmPopup.module.css";

export interface ConfirmPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmPopup({
    message,
    onConfirm,
    onCancel
}: ConfirmPopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}