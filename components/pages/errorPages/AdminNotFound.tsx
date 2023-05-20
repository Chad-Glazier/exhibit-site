import styles from "./NotFound.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";

export default function AdminNotFound({
  userData
}: {
  userData: UserData
}) {
  return (
    <AdminLayout
      pageName="404"
      userData={userData}
    >
      <h1>404: Page not Found</h1>
      <p>The requested page could not be found.</p>
    </AdminLayout>
  );
}