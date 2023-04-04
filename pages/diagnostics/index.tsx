/**
 * This page is meant for developers to test the API. It is not meant to be used
 * by the public or administrators, though it technically could be as it doesn't
 * expose any sensitive data without the normal verification required.
 */
import ApiTest, { runTest } from "../../components/testing/ApiTest";
import React, { useState } from 'react';
import styles from "@/styles/TestingDashboard.module.css";
import Popup from "@/components/testing/Popup";
import tests from "@/components/testing/tests";
import { withAuth } from "@/components/hoc";
import Head from "next/head";

function TestingDashboard() {
  const [allTestsResults, setAllTestsResults] = useState<boolean[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  async function handleRunAllTests() {
    const results = await Promise.all(
      tests.map(async (test) => {
        const result = await runTest(test);
        return result.passed;
      })
    );
    setAllTestsResults(results);
    if (results.length > 0 
      && results.every(result => result)
     ) setShowPopup(true);
    else {
      for (let i = 0; i < results.length; i++) {
        if (results[i] == false) {
          const element = document.getElementById(`test_${i}`);
          element?.scrollIntoView({ behavior: "smooth"});
          break;
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Website Diagnostics | The Museum & Archives of Vernon</title>
      </Head>
      <div className={styles.dashboard}>
        {showPopup &&
          <Popup content={(
              <p>All tests passed!</p>
            )} onClose={() => setShowPopup(false)}
          />
        }
        <header className={styles.header}>
          <h1>API Testing Dashboard</h1>
          <button className={styles.runAllButton} onClick={handleRunAllTests}>
            Run All Tests
          </button>
        </header>
        <div className={styles.tests}>
          {tests.map((test, index) => (
            <div key={index} id={`test_${index}`}>
              <ApiTest {...test} passed={allTestsResults[index]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default withAuth(TestingDashboard);