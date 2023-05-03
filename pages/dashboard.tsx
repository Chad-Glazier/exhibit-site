import prisma from "@/prisma";
import { PopulatedExhibit } from "@/types";
import { GetServerSideProps } from "next";
import { authorized } from "@/util/server";
import { ApiClient } from "@/util/client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { AdminNav, CreateExhibitPopup, ConfirmPopup } from "@/components";
import styles from "@/styles/Dashboard.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!(await authorized(context.req.cookies))) {
    return { redirect: { destination: "/login", permanent: false }};
  }
  const initialExhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({ include: { cards: true }});
  return { props: { initialExhibits } };     
}

export default function Dashboard({
  initialExhibits
}: {
  initialExhibits: PopulatedExhibit[]
}) {
  const [exhibits, setExhibits] = useState<PopulatedExhibit[]>(initialExhibits);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  async function fetchExhibits() {
    const res = await ApiClient.Exhibit.getAll();
    if (res.ok) {
      setExhibits(res.body);
      return;
    }
    console.log(res.error);
  }

  async function createExhibit(title: string) {
    const response = await fetch("/api/exhibit", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        summary: "",
        thumbnail: "",
        cards: [],
        published: false
      })
    });
    fetchExhibits();
  }

  async function togglePublish(title: string, published: boolean) {
    const exhibitToUpdate = exhibits.find(exhibit => exhibit.title === title);
    if (!exhibitToUpdate) return;

    const updatedExhibit = { ...exhibitToUpdate, published: !published };
    await fetch("/api/exhibit", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExhibit)
    });
    fetchExhibits();
  }

  function ExhibitTile({ exhibit }: { exhibit: PopulatedExhibit }) {
    const { title, thumbnail, published } = exhibit;
    const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

    return (
      <>
        <AdminNav />
        {showConfirmPopup &&
          <ConfirmPopup
            message={`Are you sure you want to permanently delete "${title}"?`}
            onCancel={() => setShowConfirmPopup(false) }
            onConfirm={() => {
              setShowConfirmPopup(false);
              ApiClient.Exhibit.deleteOne(title);
            }}
          />
        }
        {showCreatePopup &&
          <CreateExhibitPopup
            onCreate={(title) => {
              createExhibit(title);
              setShowCreatePopup(false);
            }}
            onCancel={() => setShowCreatePopup(false)}
          />
        }
        <div className={styles.exhibitTile}>
          <img className={styles.thumbnail} src={thumbnail} alt={title} />
          <h3>{title}</h3>
          <div className={styles.actions}>
            <button onClick={() => setShowConfirmPopup(true)}>Delete</button>
            <button onClick={() => togglePublish(title, published)}>
              {published ? "Unpublish" : "Publish"}
            </button>
            <Link target="_blank" href={`/preview/${title}`}>
                <button>Preview</button>
            </Link>
            <Link href={`/designer/${title}`}>
                <button>Edit</button>
            </Link>
          </div>
        </div>      
      </>

    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | The Museum & Archives of Vernon</title>
      </Head>
      <div className={styles.dashboard}>
        <div className={styles.publishedExhibits}>
          <h1>Published Exhibits</h1>
          <div className={styles.exhibitTiles}>
            {exhibits
              .filter(exhibit => exhibit.published)
              .map(exhibit => (
                <ExhibitTile key={exhibit.title} exhibit={exhibit} />
              ))}
          </div>
        </div>
        <div className={styles.draftExhibits}>
          <h1>Exhibit Drafts</h1>
          <div className={styles.exhibitTiles}>
            {exhibits
              .filter(exhibit => !exhibit.published)
              .map(exhibit => (
                <ExhibitTile key={exhibit.title} exhibit={exhibit} />
              ))}
            <div 
              className={styles.createButton + " " + styles.exhibitTile}
              onClick={() => setShowCreatePopup(true)}
            >
              <h3>Create New</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
