import styles from "./NotFound.module.css";
import { AdminLayout } from "@/components/layouts";

export default function AdminNotFound() {
  return (
    <AdminLayout>
      <h1>404: Page not Found</h1>
      <p>The requested page could not be found.</p>
    </AdminLayout>
  );
}