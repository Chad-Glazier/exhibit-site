import styles from "./User.module.css";
import DeleteUser from "./DeleteUser";
import { UserData } from "@/types";
import { useState } from "react";

export default function User({
  userData,
  activeUserData,
  onDelete
}: {
  userData: UserData;
  activeUserData: UserData;
  onDelete: () => void;
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <>
      <DeleteUser 
        show={showDeletePopup} 
        onClose={() => setShowDeletePopup(false)}
        onConfirm={onDelete}
        userData={userData} 
      />
      <tr>
        <td>
          {userData.email === activeUserData.email ?
            <em>{userData.name}</em>
            : 
            userData.name
          } 
          {userData.isMaster && ` (Admin)`}
        </td>
        <td>
          {userData.email}
        </td>
        <td>
          {activeUserData.isMaster && userData.email !== activeUserData.email &&
            <button
              className={styles.button}
              onClick={() => setShowDeletePopup(true)}
            >
              Delete
            </button>
          }          
        </td>
      </tr>    
    </>
  )
}