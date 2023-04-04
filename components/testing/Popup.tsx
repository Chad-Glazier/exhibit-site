import { useState } from "react";
import styles from "@/styles/Popup.module.css";

interface PopupProps {
  content: React.ReactNode;
  onClose: () => void;
}

export default function Popup({ content, onClose }: PopupProps) {
  const [visible, setVisible] = useState(true);

  function handleClick() {
    setVisible(false);
    onClose();
  }

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleClick}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
