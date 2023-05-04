import Image from "next/image";
import Link from "next/link";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.logo} href="/">
        <Image
          src="/logo.svg"
          alt="The Museum & Archives of Vernon Logo"
          width={356}
          height={93}
        />
      </Link>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link href="/exhibits" className={styles.navbarLink}>
            Exhibits
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/about" className={styles.navbarLink}>
            About
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link href="/contact" className={styles.navbarLink}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}