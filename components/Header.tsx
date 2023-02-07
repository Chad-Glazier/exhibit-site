import styles from "@/styles/Header.module.css";

export interface NavigationLink {
    url: string;
    label: string;
}

export interface SocialLink {
    url: string;
    icon: string;
}

export interface HeaderProps {
    navigationLinks: NavigationLink[];
    socialLinks: SocialLink[];
}

export default function Header({navigationLinks, socialLinks}: HeaderProps) {
    return (
    <>
        <header className={styles.header}>
            <img
                className="logo" 
                src={"/logo.svg"} 
                alt={"Vernon Museum logo"}
                width={356}
                max-width={"80%"}
            />

            <ul className={styles.social}>
                {socialLinks.map(({url, icon}: SocialLink, i: number) => (
                    <li key={i}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={icon} alt="Social media icon" width="20px" height="20px" />
                        </a>
                    </li>                        
                ))}
            </ul>
        </header>

        <ul className={styles.nav}>
            {navigationLinks.map(({url, label}: NavigationLink, i: number) => (
                <li key={i}>
                    <a className="nav-link" href={url}>{label}</a>
                </li>
            ))}
        </ul>
    </>
    );
}