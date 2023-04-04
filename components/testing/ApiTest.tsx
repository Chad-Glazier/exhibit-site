import { ZodArray, ZodObject } from "zod";
import styles from "@/styles/ApiTest.module.css";
import { useState } from "react";
import PrettyObject from "./PrettyObject";

export interface ApiTestProps {
  name: string;
  url: string;
  request: RequestInit;
  expectedReponseBodies: (ZodObject<any> | ZodArray<any>)[];
}

interface ApiTestResults {
  status: number;
  cookie: string | null;
  body: any;
  passed: boolean;
}

export default function ApiTest({
  name,
  url,
  request,
  expectedReponseBodies,
  passed
}: ApiTestProps & { passed?: boolean }) {
  const [testResults, setTestResults] = useState<ApiTestResults | null>(null);

  async function handleRunTest() {
    const results = await runTest({ name, url, request, expectedReponseBodies });
    setTestResults(results);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title + " " +
        (testResults || passed ?
          testResults?.passed || passed ?
            styles.passed
            : styles.failed
          : "")
      }>{name}</h1>
      <div className={styles.reqResContainer}>
        <div className={styles.req}>
          <h2>Request</h2>
          <code className={styles.code}>
            fetch("{url}",<br />
              <div className={styles.reqObj}>
              <PrettyObject object={request} />
              </div>
            );
          </code>
        </div>
        <div className={styles.res}>
          <h2>Response</h2>
          <div className={styles.headers + " " +
            (testResults ?
              testResults?.passed ?
                styles.passed
                : styles.failed
              : "")
          }>
            {testResults && <p>Status: {testResults.status}</p>}
            {testResults && testResults.cookie && <p>Set-Cookie: {testResults.cookie}</p>}
          </div>
          <div className={styles.body + " " +
            (testResults ?
              testResults?.passed ?
                styles.passed
                : styles.failed
              : "")
          }>
            {testResults &&
              <PrettyObject object={testResults.body} />
            }
          </div>
        </div>
      </div>
      <button className={styles.button} onClick={handleRunTest}>
        Run Test
      </button>
    </div>
  );
}

export async function runTest({ url, request, expectedReponseBodies}: ApiTestProps): Promise<ApiTestResults> {
  const res = await fetch(url, request);
  const body = await res.json();
  const status = res.status;
  const cookie = res.headers.get("Set-Cookie");

  let passed: boolean = expectedReponseBodies.map(
    el => el.safeParse(body).success
  ).reduce((a, b) => a || b);
  
  return {
    status,
    cookie,
    body,
    passed
  };
}
