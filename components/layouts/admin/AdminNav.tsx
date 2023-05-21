import Image from "next/image";
import Link from "next/link";
import styles from "./AdminNav.module.css";

export default function AdminNav() {
  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard">
        <Image
          src="/logo-white.svg"
          alt="The Museum Logo"
          width={191}
          height={50}
        />
      </Link>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link href="/gallery" className={styles.navbarLink}>
            Gallery
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/dashboard" className={styles.navbarLink}>
            Exhibits
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/designer" className={styles.navbarLink}>
            Designer
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/accounts" className={styles.navbarLink}>
            Accounts
          </Link>
        </li>
      </ul>
    </nav>
  );
}