import styles from "./Accounts.module.css";
import { UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { api } from "@/util/client";
import { useState } from "react";
import User from "./User";
import CreateUserForm from "./CreateUserForm";
import MyAccount from "./MyAccount";

export default function Accounts({
  users,
  userData
}: {
  users: UserData[];
  userData: UserData;
}) {
  const [userCache, setUserCache] = useState<UserData[]>(users);

  return (
    <AdminLayout>
      <MyAccount userData={userData} />
      <h1>Other Users</h1>
      {userCache.filter(({ email }) => email !== userData.email).map((user, index) => (
        <User
          key={index}
          activeUserData={userData}
          userData={user}
          onDelete={(userData) => {
            api.user.deleteOne(userData.email);
            setUserCache(userCache.filter(({ email }) => email !== userData.email))
          }}
        />
      ))}
      {userData.isMaster && 
        <CreateUserForm
          existingUsers={userCache}
          onUserCreate={async (user) => {
            setUserCache([...userCache, user]);
            const res = await api.user.post(user, { dontLogIn: true });
            if (!res.ok) {
              alert(res.error);
              setUserCache(userCache.filter(({ email }) => email !== user.email));
            }
          }}
        />
      }
    </AdminLayout>    
  );
}