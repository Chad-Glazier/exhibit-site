import styles from "./Banner.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Banner({
  inAnExhibit
}: {
  inAnExhibit?: boolean;
}) {
  return (
    <div className={styles.banner}>
      <Link className={styles.logo} href={inAnExhibit ? "/" : "https://vernonmuseum.ca/"}>
        <Image
          className={styles.logoImage}
          src="/logo.svg"
          alt="The Museum & Archives of Vernon Logo"
          width={356}
          height={93}
        />
      </Link>
      <div className={styles.socialIcons}>
        <Link target="_blank" href="https://www.facebook.com/vernonmuseum/">
          <Image 
            src="/social-icons/facebook.svg"
            alt="Facebook Icon"
            width={16}
            height={16}
          />
        </Link>
        <Link target="_blank" href="https://twitter.com/Vernon_Museum">
          <Image 
            src="/social-icons/twitter.svg"
            alt="Facebook Icon"
            width={16}
            height={16}
          />
        </Link>          
        <Link target="_blank" href="https://www.instagram.com/vernon_museum/">
          <Image 
            src="/social-icons/instagram.svg"
            alt="Facebook Icon"
            width={16}
            height={16}
          />
        </Link>
        <Link target="_blank" href="https://www.youtube.com/channel/UCtLtOUPyI6Qd4XApN-OmeHQ">
          <Image 
            src="/social-icons/youtube.svg"
            alt="Facebook Icon"
            width={16}
            height={16}
          />
        </Link>
      </div>
    </div>
  );
}