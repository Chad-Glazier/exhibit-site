import styles from "./User.module.css";
import { Popup } from "@/components/general";
import { UserData } from "@/types";
import { useState } from "react";

export default function User({
  userData,
  activeUserData,
  onDelete
}: {
  userData: UserData;
  activeUserData: UserData;
  onDelete: (userData: UserData) => void;
}) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Popup
        show={showPopup}
        onClickAway={() => setShowPopup(false)}
      >
        <h1>Delete User</h1>
        <p>Are you sure you want to delete user &quot;{userData.name}&quot;&#x3F;</p>
        <button onClick={() => {
          onDelete(userData);
          setShowPopup(false);
        }}>
          Confirm
        </button>
        <button onClick={() => setShowPopup(false)}>
          Cancel
        </button>
      </Popup>
      <div>
        <h2>
          {userData.email === activeUserData.email ?
            <em>{userData.name}</em>
            : 
            userData.name
          } 
          {userData.isMaster && ` (Admin)`}
        </h2>
        <p>Email: {userData.email}</p>
        {activeUserData.isMaster && userData.email !== activeUserData.email &&
          <button onClick={() => setShowPopup(true)}>
            Delete
          </button>
        }
      </div>    
    </>

  )
}