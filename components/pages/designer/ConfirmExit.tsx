import styles from "./ConfirmExit.module.css";
import { Popup, LoadingOverlay } from "@/components/general";
import { useState } from "react";
import Link from "next/link";


export default function ConfirmExit({
  show,
  onCancel
}: {
  show: boolean;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);  
  
  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup
        show={show}
        onClickAway={onCancel}
      >
        <div className={styles.container}>
          <h2 className={styles.title}>Confirm Exit</h2>
          <p>
            Are you sure you want to exit without saving?
          </p>
          <div className={styles.buttons}>
            <Link 
              className={styles.button}
              href="/dashboard"
              onClick={() => setLoading(true)}
            >
              Exit Without Saving
            </Link>
            <button 
              className={styles.button}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popup>
    </>
  )
}