import styles from "./Exhibit.module.css";
import { PopulatedExhibitCreatable } from "@/types";
import { Layout } from "@/components/layouts";

export default function Exhibit({
  exhibit
}: {
  exhibit: PopulatedExhibitCreatable;
}) {

  return (
    <Layout 
      pageName={exhibit.title} 
      className={styles.background}
    >
      
    </Layout>
  )
}
