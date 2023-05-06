import styles from "./NotFound.module.css";
import { Layout } from "@/components/layouts";

export default function NotFound() {
  return (
    <Layout>
      <h1>404: Page not Found</h1>
      <p>The requested page could not be found.</p>
    </Layout>
  );
}