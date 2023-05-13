import styles from "./ServerError.module.css";
import { AdminLayout } from "@/components/layouts";

export default function AdminServerError() {
  return (
    <AdminLayout>
      <h1>500: Server Error</h1>
      <p>The server encountered an unexpected error.</p>
    </AdminLayout>
  )
}