import styles from "./ServerError.module.css"
import { Layout } from "@/components/layouts";

export default function ServerError() {
  return (
    <Layout>
      <h1>500: Server Error</h1>
      <p>The server encountered an unexpected error.</p>
    </Layout>
  )
}