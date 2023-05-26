import styles from "./Footer.module.css";
import Link from "next/link";

const links = new Map();
links.set("Visit", "https://vernonmuseum.ca/visit/");
links.set("Archives", "https://vernonmuseum.ca/archives/");
links.set("Exhibits", "https://vernonmuseum.ca/exhibits");
links.set("Programs", "https://vernonmuseum.ca/schoolprograms/");
links.set("Rentals", "https://vernonmuseum.ca/rentals/");
links.set("Repatriation", "https://vernonmuseum.ca/repatriation/");
links.set("Blog", "https://vernonmuseum.ca/blog/");
links.set("Volunteer", "https://vernonmuseum.ca/volunteer-opportunities/");
links.set("Shop", "https://greatervernonmuseum.square.site/s/shop");
links.set("Donate", "https://www.canadahelps.org/en/charities/greater-vernon-museum-and-archives/");
links.set("Contact", "https://vernonmuseum.ca/contact-us-mav/");

const toLink = (str: string) => <Link href={links.get(str) ?? "/404"}>{str}</Link>;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        {"Visit Archives Exhibits Programs Rentals Repatriation Blog Volunteer Shop Donate Contact"
          .split(" ")
          .map((str, index, { length }) => {
            if (index === length - 1) {
              return toLink(str);
            } else {
              return <>{toLink(str)} | </>;
            }
          })
        } 
      </p>
      <p>
        &copy; 2020 Greater Vernon Museum and Archives 
        |&nbsp;
        <Link
          title="Click to find the Museum on Google Maps"
          target="_blank"
          href="https://www.google.com/maps/place/The+Museum+%26+Archives+of+Vernon/@50.2659334,-119.2717865,17z/data=!3m1!5s0x537dd8e8327eea3f:0x6838ecdf25789198!4m15!1m8!3m7!1s0x537dd8e832eb9cf3:0x307c991f88ef6664!2s3009+32nd+Ave,+Vernon,+BC+V1T+2L8!3b1!8m2!3d50.2659334!4d-119.2717865!16s%2Fg%2F11b8vc8t7h!3m5!1s0x537dd8e82524aeb1:0x59fde92d6d2da6a4!8m2!3d50.2657839!4d-119.2716863!16s%2Fg%2F1tfx4k_h?entry=ttu"
        >        
          3009 32nd Avenue, Vernon BC, V1T 2L8 
        </Link>
        &nbsp;|&nbsp;
        <Link
          title="Click to call the Museum"
          target="_blank"
          href="tel:12505503140"
        >
          250-550-3140
        </Link> 
        &nbsp;|&nbsp; 
        <Link
          title="Click to email the Museum"
          target="_blank"
          href="mailto:web-contact@vernonmuseum.ca"
        >
          web-contact@vernonmuseum.ca
        </Link>
      </p>
    </footer>
  )
}