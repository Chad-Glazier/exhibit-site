import styles from "./ExhibitTiles.module.css";
import { ExhibitCreatable } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { TextEditor } from "@/components/general";
import { useState } from "react";

export default function ExhibitTiles({
  exhibits,
  className
}: {
  exhibits: ExhibitCreatable[];
  className?: string;
}) {
  const pageLength = 5;
  const [page, setPage] = useState(0);

  return (
    <>
      <section
        className={
          styles.exhibitTiles
          + (className ? ` ${className}` : "")
        }
      >
        <h1
          className={styles.heading}   
        >
          Virtual Exhibits
        </h1>
        {
          exhibits
            .slice(page * pageLength, (page + 1) * pageLength)
            .map(({ title, summary, thumbnail }) => 
              <Link
                className={styles.exhibitTile}
                key={title}
                href={`/${encodeURIComponent(title)}`}
              >
                <Image
                  className={styles.thumbnail}
                  height={300}
                  width={400}
                  src={thumbnail}
                  alt={title}
                />
                <div
                  className={styles.text}
                >
                  <h2
                    className={styles.title}
                  >
                    {title}
                  </h2>
                  <TextEditor
                    className={styles.summary}
                    innerClassName={styles.summaryInner}
                    initialState={summary}
                    readonly={true}
                  />
                </div>
                <Image
                  className={styles.arrow}
                  src={"/arrow-right.svg"}
                  alt="read more"
                  height={40}
                  width={40}
                />
              </Link>
            )
        }
        <div
          className={styles.pagination}
        >
          {
            Array(Math.ceil(exhibits.length / pageLength)).fill(0).map((_, index) =>
              <h3
                key={index}
                className={styles.pageNumber}
                data-status={index === page ? "active" : "inactive"}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </h3>
            )
          }
        </div>
      </section>      
    </>
  )
}