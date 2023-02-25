import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header, { HeaderProps } from "@/components/Header";
import Navigation, { NavigationProps } from "@/components/Navigation";

const headerProps: HeaderProps = {
    socialLinks: [
        { 
            url: "https://www.facebook.com/vernonmuseum/", 
            icon: "/social-icons/facebook.svg" 
        },
        { 
            url: "https://www.instagram.com/vernon_museum/", 
            icon: "/social-icons/instagram.svg" 
        },
        { 
            url: "https://twitter.com/Vernon_Museum", 
            icon: "/social-icons/twitter.svg" 
        },
        { 
            url: "https://www.youtube.com/channel/UCtLtOUPyI6Qd4XApN-OmeHQ", 
            icon: "/social-icons/youtube.svg" 
        }
    ]
}

const navigationProps: NavigationProps = {
    links: [
        {
            url: "https://vernonmuseum.ca",
            label: "Main Site"
        },
        {
            url: "https://vernonmuseum.ca/archives/",
            label: "Archives"
        },
        {
            url: "https://vernonmuseum.ca/contact-us-mav/",
            label: "Contact"
        }
    ]
}

export default function Home() {
    return (
    <>
        <Head>
            <title>The Museum & Archives of Vernon | Virtual Exhibits</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className={styles.main}>
            <Header {...headerProps} />
            <Navigation {...navigationProps} />
        </main>
    </>
    );
}
