import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header, { HeaderProps } from "@/components/Header";

const headerProps: HeaderProps = {
    navigationLinks: [
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
    ],
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

export default function Home() {
    return (
    <>
        <Head>
            <title>The Museum & Archives of Vernon | Virtual Exhibits</title>
            <meta name="description" content="The Greater Museum and Archives is dedicated to creating an understanding of the North Okanagan through stories, exhibits and archives." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            <link rel="manifest" href="/favicon/site.webmanifest" />
            <link rel="icon" href="/favicon/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <Header {...headerProps} />
        </main>
    </>
    )
}
