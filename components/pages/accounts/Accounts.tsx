import styles from "./Accounts.module.css";
import { UserData } from "@/types";
import { AdminLayout } from "@/components/layouts";
import { api } from "@/util/client";
import { useState } from "react";
import User from "./User";
import CreateUserForm from "./CreateUserForm";
import { Popup, LoadingOverlay } from "@/components/general";
import ChangePasswordForm from "./ChangePasswordForm";
import Head from "next/head";

export default function Accounts({
  users,
  userData
}: {
  users: UserData[];
  userData: UserData;
}) {
  const [userCache, setUserCache] = useState<UserData[]>(users);
  const [showUserCreateForm, setShowUserCreateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Popup show={showUserCreateForm && !loading} onClickAway={() => setShowUserCreateForm(false)}>
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
      <AdminLayout
        pageName="Accounts"
        userData={userData}
      >
        <ChangePasswordForm 
          show={showPasswordForm} 
          userData={userData} 
          onClose={() => setShowPasswordForm(false)}
        />
        <section className={styles.section}>
          <h1 className={styles.title}>My Account</h1>
          <div className={styles.tableContainer}>
            <table
              className={styles.table}
            >
              <tbody>
                <tr>
                  <td className={styles.label}>Name</td>
                  <td>{userData.name}</td>
                </tr>
                <tr>
                  <td className={styles.label}>Email</td>
                  <td className={styles.email}>{userData.email}</td>
                </tr>            
              </tbody>
            </table>
            <button 
              className={styles.button}
              onClick={() => {
                setShowPasswordForm(true);
              }}
            > 
              Change Password
            </button>  
          </div>      
        </section>
        <section className={styles.section}>
          <h1 className={styles.title}>Other Users</h1>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {userData.isMaster && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
              {userCache.filter(({ email }) => email !== userData.email).map((user, index) => (
                <User
                  key={index}
                  activeUserData={userData}
                  userData={user}
                  onDelete={() => setUserCache(userCache.filter(({ email }) => email !== user.email))}
                />
              ))}                          
              </tbody>
            </table>
            {userData.isMaster && 
              <button
                className={styles.button}
                onClick={() => setShowUserCreateForm(true)}
              >
                Add User
              </button>
            } 
          </div>           
        </section>
      </AdminLayout>     
    </>
  );
}