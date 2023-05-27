import styles from "./Home.module.css";
import { Layout } from "@/components/layouts";
import { PopulatedExhibit } from "@/types";
import Thumbnail from "./Thumbnail";
import Carousel from "./Carousel";
import { useState } from "react";

export default function Home({
  allExhibits
}: {
  allExhibits: PopulatedExhibit[];
}) {
  const [pageIndex, setPageIndex] = useState(0); 
  const pageLength = 5;
  const numberOfPages = Math.ceil(allExhibits.length / pageLength);

  return (
    <Layout pageName="Exhibits">
      <Carousel 
        exhibits={allExhibits.slice(0, pageLength)}
      />
      <h1 className={styles.title}>Virtual Exhibits</h1>
      <main className={styles.page}>
        {
          allExhibits
            .slice(pageIndex * pageLength, pageIndex * pageLength + pageLength)
            .map(exhibit => 
              <Thumbnail 
                key={exhibit.title} 
                exhibit={exhibit} 
              />
            ) 
        }
      </main>
      {numberOfPages > 1 &&
        <nav className={styles.pagination}>
          {Array(numberOfPages).fill(0).map((_, i) => 
            <button
              className={styles.pageButton}
              key={i}
              onClick={() => setPageIndex(i)}
              data-status={i === pageIndex ? "active" : "inactive"}
            >
              {i + 1}
            </button>
          )}
        </nav>        
      }
    </Layout>
  )
}

function isOutOfView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.bottom < 0 ||
    rect.right < 0 ||
    rect.left > window.innerWidth ||
    rect.top > window.innerHeight
  );
}