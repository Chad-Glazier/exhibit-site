import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay({
  show
}: {
  show?: boolean;
}) {
  if (!show) return <></>;

  return (
    <div className={styles.overlay}>
      <div className={styles.ldsEllipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ); 
}