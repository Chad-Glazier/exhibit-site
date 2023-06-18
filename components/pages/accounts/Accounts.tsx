import styles from "./Accounts.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";
import MyAccount from "./MyAccount";
import { useState } from "react";

export default function Accounts({
  userData
}: {
  userData: UserData
}) {
  const [userDataCache, setUserDataCache] = useState(userData);

  return (
    <AdminLayout
      userData={userData}
      pageName="Accounts"
      className={
        styles.page
      }
    >
      <h1
        className={styles.heading}
      >
        My Account
      </h1>
      <MyAccount 
        userData={userDataCache}
        onUpdate={setUserDataCache}
      />
    </AdminLayout>
  );
}