import styles from "./MyAccount.module.css";
import { UserData, UserType } from "@/types";
import { useState, useRef } from "react";
import { api } from "@/util/client";
import { LoadingOverlay } from "@/components/general";
import Image from "next/image";

export default function MyAccount({
  userData,
  onUpdate
}: {
  userData: UserData;
  onUpdate: (userData: UserData) => void;
}) {
  const { name, email } = userData;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("any fields left blank will remain unchanged");

  return (
    <>
      <LoadingOverlay 
        show={loading}
      />
      <form className={styles.info}
        data-status={editMode ? "edit" : "view"}
        onClick={() => setEditMode(true)}
        onSubmit={async (e) => {
          e.preventDefault();

          const updatedName = (document.getElementById("name") as HTMLInputElement).value;
          const updatedEmail = (document.getElementById("email") as HTMLInputElement).value;
          const password = (document.getElementById("password") as HTMLInputElement).value;
          const passwordConfirm = (document.getElementById("password-confirm") as HTMLInputElement).value;

          let newUserData: Partial<UserType> = {};
          if (updatedName !== name && updatedName !== "") {
            newUserData.name = updatedName;
          }
          if (updatedEmail !== email && updatedEmail !== "") {
            newUserData.email = updatedEmail;
          }
          if (password !== "" || passwordConfirm !== "") {
            if (passwordConfirm !== password) {
              setNote("Passwords must match");
              return;
            }
            newUserData.password = password;
          }

          if (Object.keys(newUserData).length === 0) {
            setEditMode(false);
            return;
          }

          setLoading(true);
          const res = await api.user.updateOne(email, newUserData);
          setLoading(false);
          if (!res.ok) {
            setNote(res.error);
            return;
          }
          setNote("any fields left blank will remain unchanged");
          onUpdate(res.body);
          setEditMode(false);
        }}
      >
        <h1
          className={styles.heading}
        >
          My Account
        </h1>
        { 
          !editMode &&
            <Image 
              src="/edit.svg"
              height={32}
              width={32}
              alt="Edit"
              className={styles.edit}
            />
        }
        <label htmlFor="name">Name</label>
        {
          editMode ?
            <input
              id="name"
              type="text"
              defaultValue={name}
            />    
            :
            <p>{name}</p>        
        }
        <label htmlFor="email">Email</label>
        {
          editMode ?
            <input
              id="email"
              type="email"
              defaultValue={email}
            />    
            :
            <p>{email}</p>        
        }
        {
          editMode &&
            <>
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
              />
              <label htmlFor="password-confirm">Confirm Password</label>
              <input
                id="password-confirm"
                type="password"
              />   
              <em
                className={styles.note}
              >
                {note}
              </em>
              <div
                className={styles.buttons}
              >
                <button>
                  Save Changes
                </button>
                <button
                  onClick={e => {
                    setEditMode(false);
                    e.stopPropagation();
                  }}
                >
                  Cancel  
                </button>                   
              </div>
            </>
        }
      </form>    
    </>
  );
}