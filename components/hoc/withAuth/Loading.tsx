import styles from "@/styles/NotFound.module.css";
import Image from "next/image";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Image
        src="/logo.svg"
        alt="Museum Logo"
        width={300}
        height={100}
      />
      <p className={styles.description}>
        Loading...
      </p>
    </div>
  );
};
