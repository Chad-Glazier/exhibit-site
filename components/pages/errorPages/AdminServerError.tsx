import styles from "./ServerError.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";

export default function AdminServerError({
  userData
}: {
  userData: UserData
}) {
  return (
    <AdminLayout
      pageName="500"
      userData={userData}
    >
      <h1>500: Server Error</h1>
      <p>The server encountered an unexpected error.</p>
    </AdminLayout>
  )
}