import React, { useEffect, useState } from 'react';
import styles from "@/styles/Dashboard.module.css";
import { WithAuthProps, withAuth } from "@/components/hoc";
import Head from "next/head";
import Link from 'next/link';
import { ErrorMessageSchema, PopulatedExhibit, PopulatedExhibitCreatable, PopulatedExhibitSchema } from '@/types';
import { ConfirmPopup, CreateExhibitPopup } from '@/components';
import { GetServerSideProps } from 'next';
import prisma from "@/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const initialExhibits: PopulatedExhibit[] = await prisma.exhibit.findMany({ include: { cards: true }});
  return { props: { initialExhibits } };
}

interface DashboardProps extends WithAuthProps {
  initialExhibits: PopulatedExhibit[];
}

function Dashboard({
  initialExhibits
}: DashboardProps) {
  const [exhibits, setExhibits] = useState<PopulatedExhibit[]>(initialExhibits);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  async function fetchExhibits() {
    const response = await fetch("/api/exhibit?title=*");
    const data: PopulatedExhibit[] = await response.json();
    setExhibits(data);
  }

  async function deleteExhibit(title: string) {
    await fetch(`/api/exhibit?title=${encodeURIComponent(title)}`, {
      method: "DELETE",
      credentials: "same-origin"
    });
    fetchExhibits();
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
        {showConfirmPopup &&
          <ConfirmPopup
            message={`Are you sure you want to permanently delete "${title}"?`}
            onCancel={() => setShowConfirmPopup(false) }
            onConfirm={() => {
              setShowConfirmPopup(false);
              deleteExhibit(title);
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
          <img className={styles.thumbnail} src={`/exhibit-media/thumbnails/${thumbnail}`} alt={title} />
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
        <h1>Dashboard</h1>
        <div className={styles.publishedExhibits}>
          <h2>Published Exhibits</h2>
          <div className={styles.exhibitTiles}>
            {exhibits
              .filter(exhibit => exhibit.published)
              .map(exhibit => (
                <ExhibitTile key={exhibit.title} exhibit={exhibit} />
              ))}
          </div>
        </div>
        <div className={styles.draftExhibits}>
          <h2>Exhibit Drafts</h2>
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

export default withAuth(Dashboard);
