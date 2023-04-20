import React from 'react';
import Link from 'next/link';
import styles from '@/styles/AdminNav.module.css';
import Image from "next/image";

export default function AdminNav() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/dashboard">
            Exhibits
          </Link>
        </li>
        <li>
          <Link href="/gallery">
            Gallery
          </Link>
        </li>
        <li>
          <Link href="/designer">
            Designer
          </Link>
        </li>
        <li>
          <Link href="/login">
            Logout
          </Link>
        </li>
        <li className={styles.help}>
          <Link href="/help">
            <img
              src="/help.svg"
              className={styles.svg}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
