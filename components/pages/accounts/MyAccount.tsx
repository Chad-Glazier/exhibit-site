import { UserData } from "@/types";
import styles from "./MyAccount.module.css";
import { api } from "@/util/client";
import { useState } from "react";
import { Popup } from "@/components/general";

export default function MyAccount({
  userData
}: {
  userData: UserData;
}) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <>
      <Popup show={showPasswordForm} onClickAway={() => setShowPasswordForm(false)}>
        <h1>Change Password</h1>
        <form onSubmit={(e) => {
          e.preventDefault();

          const newPassword = (e.currentTarget.elements.namedItem("new-password") as HTMLInputElement).value;
          const newPasswordConfirm = (e.currentTarget.elements.namedItem("new-password-confirm") as HTMLInputElement).value;

          if (newPassword !== newPasswordConfirm) {
            alert("Passwords do not match");
            return;
          }

          api.user.put({
            ...userData,
            password: newPassword,
          }).then((res) => {
            if (!res.ok) {
              alert(res.error);
            }
          });

          setShowPasswordForm(false);
        }}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" name="new-password" required />
          <label htmlFor="new-password-confirm">Confirm New Password</label>
          <input type="password" id="new-password-confirm" name="new-password-confirm" required />
          <button>
            Submit
          </button>
        </form>
      </Popup>
      <div>
        <h1>My Account</h1>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <button onClick={() => {
          setShowPasswordForm(true);
        }}> 
          Change Password
        </button>
      </div>    
    </>

  )
}