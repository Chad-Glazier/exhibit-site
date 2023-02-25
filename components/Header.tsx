import styles from "@/styles/Header.module.css";

export interface SocialLink {
    url: string;
    icon: string;
}

export interface HeaderProps {
    socialLinks: SocialLink[];
}

export default function Header({ socialLinks }: HeaderProps) {
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
    </>
    );
}