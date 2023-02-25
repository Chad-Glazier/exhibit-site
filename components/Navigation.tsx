import styles from "@/styles/Navigation.module.css";
import Link from "next/link";

export interface NavigationLink {
    url: string;
    label: string;
}

export interface NavigationProps {
    links: NavigationLink[]
};

export default function Navigation({ links }: NavigationProps) {
    return (
    <nav className={styles.nav}>
        {links.map(({url, label}: NavigationLink, i: number) => (
            <Link className={styles.link} href={url}>{label}</Link>
        ))}
    </nav>
    );
}