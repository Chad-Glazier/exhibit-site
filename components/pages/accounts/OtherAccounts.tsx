import styles from "./OtherAccounts.module.css";
import { UserData } from "@/types";
import Link from "next/link";
import { useState, useRef } from "react";
import PasswordReset from "./PasswordReset";
import DeleteAccount from "./DeleteAccount";

export default function OtherAccounts({
  allUsers,
  activeUser,
  onDeleteUser
}: {
  allUsers: UserData[];
  activeUser: UserData;
  onDeleteUser: (email: string) => void;
}) {
  const [showDelete, setShowDelete] = useState(false);
  const deletionTarget = useRef<UserData | null>(null);
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <PasswordReset
        show={showReset}
        email={activeUser.email}
        close={() => setShowReset(false)}
        forceShow={() => setShowReset(true)}
      />
      <DeleteAccount
        show={showDelete}
        userData={deletionTarget.current!}
        close={() => {
          setShowDelete(false);
          deletionTarget.current = null;
        }}
        onDelete={onDeleteUser}
      />
      <section
        className={styles.container}
        data-type={activeUser.isMaster ? "admin" : "normal"}
      >
        <h1
          className={styles.heading}
        >
          Other Accounts
        </h1>
        <table
          className={styles.table}
        >
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Email
              </th>
              {
                activeUser.isMaster &&
                  <th>
                    Options
                  </th>
              }
            </tr>
          </thead>
          <tbody>
            {
              allUsers.length <= 1 ?
                <tr>
                  <td colSpan={activeUser.isMaster ? 3 : 2}>
                    <em className={styles.note}>No other accounts</em>
                  </td>
                </tr>
              :
                allUsers
                  .filter(({ email }) => email !== activeUser.email)
                  .map(user =>
                      <tr key={user.email}>
                        <td>
                          {user.name + (user.isMaster ? " (Admin)" : "")}
                        </td>
                        <td
                          className={styles.email}
                        >
                          <Link
                            href={`mailto:${user.email}`}
                            className={styles.link}
                            target="_blank"
                          >
                            {user.email}
                          </Link>
                        </td>
                        {
                          activeUser.isMaster &&
                            <td
                              className={styles.buttons}
                            >
                              <button
                                onClick={() => setShowReset(true)}
                              >
                                Reset Password
                              </button>
                              <button
                                onClick={() => {
                                  deletionTarget.current = user;
                                  setShowDelete(true);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                        }
                      </tr>
                    )
            }
          </tbody>
        </table>      
      </section>
    </>
  );
}