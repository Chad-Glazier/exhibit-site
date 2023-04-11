import ApiTest, { runTest } from "../../components/testing/ApiTest";
import React, { useState } from "react";
import styles from "@/styles/TestingDashboard.module.css";
import Popup from "@/components/testing/Popup";
import tests from "./tests";
import { withAuth } from "@/components/hoc";
import Head from "next/head";

function TestingDashboard() {
  const [allTestsResults, setAllTestsResults] = useState<boolean[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  async function handleRunAllTests() {
    let results: boolean[] = [];
    for (let i = 0; i < tests.length; i++) {
      const { passed } = await runTest(tests[i]);
      results[i] = passed;
    }
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
        <div className={styles.explanation}>
          <p>
            This page is meant for developers to test out the API. What follows is a series of tests; you may try them individually or all
            at once with the &ldquo;Run All Tests&ldquo; button. A test is considered to have &ldquo;passed&ldquo; if it sends back a request of the expected type,
            regardless of status codes.
          </p>
          <br />
          <p>
            Note that, although they are able to be individually ran, some tests depend on others so it&apos;s best to do them in the order that they appear. E.g., the &ldquo;delete&ldquo; tests delete exhibits made by the &ldquo;create&ldquo; tests.
          </p>
          <br />
          <p>
            There exist authentication requests for the API, but they are not included here because proper tests for them would demand exposing unhashed, working credentials. However, you may read about those endpoints <a href="#credentials">by clicking here</a>.
          </p>
        </div>
        <div className={styles.tests}>
          {tests.map((test, index) => (
            <div key={index} id={`test_${index}`}>
              <ApiTest {...test} passed={allTestsResults[index]} />
            </div>
          ))}
        </div>
        <div id="credentials" className={styles.documentation}>
        <h2>Authentication</h2>
      <p>
        The API is primarily meant for the Museum&apos;s administrative website, so most of the API endpoints require authentication. Authentication is via cookies; each cookie has the key <code>token</code> and the value is an encrypted JSON Web Token that includes the user&apos;s email address as the payload. This way, the user can be both authenticated and identified with the cookie.
      </p>

      <h3>Authenticate a User</h3>
      <p>
        In order to get such a cookie from the API, send a request to <code>/api/authenticate</code>, and include a JSON body that includes the user&apos;s <code>email</code> and <code>password</code> (unhashed). E.g.,
      </p>
      <pre>
        {`const response = await fetch(
          "/api/user/authenticate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                email: "rinkyDinkValtruvian@gmail.com", 
                password: "killBinkyBong"
            })
        });`}
      </pre>
      <ul>
        <li>
          If the credentials are correct, you will get a response of <code>200</code>, a header to set the <code>token</code> cookie, and a body that includes the <code>UserData</code> (i.e., the user&apos;s information except for their password).
        </li>
        <li>
          Otherwise, it will send back a 4XX status code and an <code>ErrorMessage</code> in the body.
        </li>
      </ul>

      <h3>Verify a User&apos;s Authenticity</h3>
      <p>
        If you want to verify a pre-existing cookie, you can send a request to the <code>/api/authenticate</code> endpoint:
      </p>
      <pre>
        {`const response: Response = await fetch("/api/user/authentic");`}
      </pre>
      <ul>
        <li>
          If the user is authenticated, the response will have a status of 200 and the body will include a <code>UserData</code> object.
        </li>
        <li>
          If the user is <em>not</em> authenticated, the response have a status of 4XX and the body will include an <code>ErrorMessage</code> object.
        </li>
      </ul>
        </div>
      </div>
    </>
  );
}

export default withAuth(TestingDashboard);