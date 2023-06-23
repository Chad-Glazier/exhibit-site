import React from "react";
import styles from "./Popup.module.css";

export default function Popup({
  show,
  onClickAway,
  children,
  darkness
}: {
  show?: boolean;
  onClickAway?: () => void;
  children?: React.ReactNode; 
  darkness?: number;
}) {
  if (!show) {
    return <></>;
  }
  return (
    <div className={styles.background} style={{ backgroundColor: `rgba(0, 0, 0, ${darkness ?? 0.5})`}} onClick={onClickAway}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );   
}