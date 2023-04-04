import Link from "next/link";
import styles from "@/styles/NotFound.module.css";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Image
        src="/logo.svg"
        alt="Museum Logo"
        width={300}
        height={100}
      />
      <p className={styles.description}>
        We're sorry, but the page you're looking for cannot be found. Please
        check the URL and try again, or go back to the <Link className={styles.link} href="/">homepage</Link>.
      </p>
    </div>
  );
};
