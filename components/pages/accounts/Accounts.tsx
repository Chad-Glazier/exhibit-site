import styles from "./Accounts.module.css";
import { AdminLayout } from "@/components/layouts";
import { UserData } from "@/types";
import MyAccount from "./MyAccount";
import { useState } from "react";
import OtherAccounts from "./OtherAccounts";
import Image from "next/image";
import AddAccount from "./AddAccount";

export default function Accounts({
  userData,
  users
}: {
  userData: UserData;
  users: UserData[];
}) {
  const [userDataCache, setUserDataCache] = useState(userData);
  const [usersCache, setUsersCache] = useState(users);
  const [showAddUser, setShowAddUser] = useState(false);

  return (
    <>
      <AddAccount
        show={showAddUser}
        close={() => setShowAddUser(false)}
        onAdd={(user: UserData) => {
          setUsersCache(prev => [...prev, user]);
        }}
        forceShow={() => setShowAddUser(true)}
        allUsers={usersCache}
      />
      <AdminLayout
        userData={userData}
        pageName="Accounts"
        className={
          styles.page
        }
      >
        <MyAccount 
          userData={userDataCache}
          onUpdate={setUserDataCache}
        />
        <OtherAccounts
          activeUser={userDataCache}
          allUsers={usersCache}
          onDeleteUser={(email: string) => {
            setUsersCache(prev => prev.filter(user => user.email !== email));
          }}
        />
        {
          userDataCache.isMaster &&
            <Image 
              src="/plus.svg"
              alt="Add Exhibit"
              width={100}
              height={120}
              className={styles.button} 
              onClick={() => setShowAddUser(true)}
            />
        }
      </AdminLayout>    
    </>
  );
}