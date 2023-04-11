import React from 'react';
import Link from 'next/link';
import styles from '@/styles/AdminNav.module.css';

export default function AdminNav() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/gallery">
            Gallery
          </Link>
        </li>
        <li>
          <Link href="/login">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
}
