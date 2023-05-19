import styles from "./Accounts.module.css";
import { UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { api } from "@/util/client";
import { useState } from "react";
import User from "./User";
import CreateUserForm from "./CreateUserForm";
import MyAccount from "./MyAccount";
import { Popup, LoadingOverlay } from "@/components/general";

export default function Accounts({
  users,
  userData
}: {
  users: UserData[];
  userData: UserData;
}) {
  const [userCache, setUserCache] = useState<UserData[]>(users);
  const [showUserCreateForm, setShowUserCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={showUserCreateForm} onClickAway={() => setShowUserCreateForm(false)}>
        <CreateUserForm
          existingUsers={userCache}
          onUserCreate={async (user) => {
            setShowUserCreateForm(false);
            setLoading(true);
            const res = await api.user.post(user, { dontLogIn: true });
            if (!res.ok) {
              alert(res.error);
            } else {
              setUserCache([...userCache, user]);
            }
            setLoading(false);
          }}
        />
      </Popup>
      <AdminLayout>
        <MyAccount userData={userData} />
        <h1>Other Users</h1>
        {userCache.filter(({ email }) => email !== userData.email).map((user, index) => (
          <User
            key={index}
            activeUserData={userData}
            userData={user}
            onDelete={async (userData) => {
              setLoading(true);
              const res = await api.user.deleteOne(userData.email);
              if (!res.ok) {
                alert(res.error);
              } else {
                setUserCache(prev => prev.filter(el => el.email !== userData.email));
              }
              setLoading(false);
            }}
          />
        ))}
        {userData.isMaster && 
          <button
            onClick={() => setShowUserCreateForm(true)}
          >
            Add User
          </button>
        }
      </AdminLayout>     
    </>
   
  );
}