import React from "react";
import styles from "./Popup.module.css";

export default function Popup({
  show,
  onClickAway,
  children
}: {
  show?: boolean;
  onClickAway?: () => void;
  children?: React.ReactNode; 
}) {
  if (!show) {
    return <></>;
  }
  return (
    <div className={styles.background} onClick={onClickAway}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );   
}