import styles from "./NavBar.module.css";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarList}>
        <Button 
          url="/" 
          text="Exhibits" 
        />
        <Button
          url="https://vernonmuseum.ca/contact-us-mav/"
          text="Contact Us"
        />
      </ul>
    </nav>
  );
}

function Button({
  url,
  text
}: {
  url: string;
  text: string;
}) {
  return (
    <li className={styles.navbarItem}>
      <Link href={url} className={styles.navbarLink}>
        {text}
      </Link>
    </li>
  );
}