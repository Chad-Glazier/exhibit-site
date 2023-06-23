import Image from "next/image";
import Link from "next/link";
import styles from "./AdminNav.module.css";

export default function AdminNav({
  onRedirect,
  pageName
}: {
  /**
   * A function that's invoked before the user attempts to redirect, and
   * determines whether or not to proceed with the redirect.
   * 
   * @returns Whether or not to redirect the user.
   */
  onRedirect?: (target: string) => boolean;
  pageName: string;
}) {
  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" onClick={(e) => {
        if (onRedirect && !onRedirect("/dashboard")) e.preventDefault();
      }}>
        <Image
          className={styles.logo}
          src="/logo-white.svg"
          alt="The Museum Logo"
          width={191}
          height={50}
        />
      </Link>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
          <Link 
            href="/gallery" 
            className={styles.navbarLink} 
            onClick={(e) => {
              if (onRedirect && !onRedirect("/gallery")) e.preventDefault();
            }}
          >
            Gallery
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link 
            href="/dashboard" 
            className={styles.navbarLink} 
            onClick={(e) => {
              if (onRedirect && !onRedirect("/dashboard")) e.preventDefault();
            }}
          >
            Exhibits
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link 
            href="/designer"
            className={styles.navbarLink} 
            onClick={(e) => {
              if (onRedirect && !onRedirect("/designer")) e.preventDefault();
            }}  
          >
            Designer
          </Link>
        </li>
        <li className={styles.navbarItem}>
          <Link 
            href="/accounts"
            className={styles.navbarLink} 
            onClick={(e) => {
              if (onRedirect && !onRedirect("/accounts")) e.preventDefault();
            }}  
          >
            Accounts
          </Link>
        </li>
      </ul>
      <Link href="/help" onClick={(e) => {
        if (onRedirect && !onRedirect("/help")) e.preventDefault();
      }}>
        <Image
          className={styles.help}
          src="/help.png"
          alt="?"
          width={24}
          height={24}
        />
      </Link>
    </nav>
  );
}