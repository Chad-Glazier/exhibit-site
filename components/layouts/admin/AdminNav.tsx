import Image from "next/image";
import Link from "next/link";
import styles from "./AdminNav.module.css";

export default function AdminNav() {
  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard">
        <Image
          src="/logo.svg"
          alt="The Museum & Archives of Vernon Logo"
          width={356}
          height={93}
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
          <Link href="/help" className={styles.navbarLink}>
            Help
          </Link>
        </li>
      </ul>
    </nav>
  );
}