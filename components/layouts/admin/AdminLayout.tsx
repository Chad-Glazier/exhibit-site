import styles from "./AdminLayout.module.css";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className={styles.main} >
        {children}
      </main>
    </>
  )
}