import styles from "./NavBar.module.css";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbarList}>
        <Button
          url="https://vernonmuseum.ca/visit/"
          text="Visit"
        />
        <Button
          url="https://vernonmuseum.ca/archives/"
          text="Archives"
        />
        <Button 
          url="/" 
          text="Exhibits" 
        />
        <Button
          url="https://vernonmuseum.ca/schoolprograms/"
          text="Programs"
        />
        <Button
          url="https://vernonmuseum.ca/rentals/"
          text="Rentals"
        />
        <Button
          url="https://vernonmuseum.ca/repatriation/"
          text="Repatriation"
        />
        <Button
          url="https://vernonmuseum.ca/blog/"
          text="Blog"
        />
        <Button
          url="https://vernonmuseum.ca/volunteer-opportunities/"
          text="Volunteer"
        />
        <Button
          url="https://greatervernonmuseum.square.site/s/shop"
          text="Shop"
        />
        <Button
          url="https://www.canadahelps.org/en/charities/greater-vernon-museum-and-archives/"
          text="Donate"
        />
        <Button
          url="https://vernonmuseum.ca/contact-us-mav/"
          text="Contact"
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