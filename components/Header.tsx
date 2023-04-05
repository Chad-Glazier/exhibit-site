import style from "@/styles/Header.module.css";
import Link from "next/link";

export default function Header(){

  return(
    <div>
      <div className={style.header}>
        <Link href="/">
          <img
            className={style.logo}
            src='/logo.svg'
          />      
        </Link>
        <div
          className={style.socialIconContainer}
        >
          <img
            className={style.socialIcon}
            src='/social-icons/youtube.svg'
          />
          <img
            className={style.socialIcon}
            src='/social-icons/facebook.svg'
          />
          <img
            className={style.socialIcon}
            src='/social-icons/twitter.svg'
          />
          <img
            className={style.socialIcon}
            src='/social-icons/instagram.svg'
          />
        </div>
      </div>
      <div
        className={style.menu}
      >
        <ul>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/visit/">Visit</a>
          </li>
          <li>
            <a href="https://vernonmuseum.ca/repatriation/">Repatriation</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/archives/">Archives</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/exhibits-programs/">Exhibits &amp; Programs</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/volunteer-opportunities/">Volunteer</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/blog/">Blog</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://vernonmuseum.ca/contact-us-mav/">Contact</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://greatervernonmuseum.square.site/s/shop">Shop</a>
          </li>
          <li>
            <a target="_blank" rel="noopener" href="https://www.canadahelps.org/en/charities/greater-vernon-museum-and-archives/">Donate</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
